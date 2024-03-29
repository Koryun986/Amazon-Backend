import {Op} from "@sequelize/core";
import sequelize from "../../database";
import {Product} from "../../database/models/product";
import {Category} from "../../database/models/category";
import {Color} from "../../database/models/color";
import {Size} from "../../database/models/size";
import {User} from "../../database/models/user";
import {ProductImage} from "../../database/models/product-images";
import {ProductParams} from "../../types/product-params-type";
import {ApiError} from "../../exceptions/api-error";
import type {ProductDto} from "../../dtos/product-dto";
import type {UserDto} from "../../dtos/user-dto";
import {NewProduct} from "../../database/models/product-with-mulitple-filteres/new-product";
import {NewProductDto} from "../../types/new-product-types";
import {extractRelativePath} from "../../utils/file-helpers";
import {NewProductImage} from "../../database/models/product-with-mulitple-filteres/new-product-image";

type ProductReturnType = ProductDto & {
  id: number;
  total_earnings: number;
  time_bought: number;
  is_published: boolean;
  main_image: string;
  images: string[];
  owner: UserDto;
}

class ProductV2Service {
  async getProducts(params: object = {}, pagination?: {limit?: string, page?: string}) {
    const limit = +pagination?.limit || 8;
    const offset = pagination?.page ? (+pagination.page - 1) * limit : 0;
    const products = await NewProduct.findAll({where: {is_published: true, ...params}, limit, offset, include: {
      all: true,
    }});
    return products;
  }

  async getProductsByParams(params: ProductParams) {
    const query: any = {};
    if (params.text) {
      query[Op.or] = {
        name: {
          [Op.substring]: params.text
        },
        description: {
          [Op.substring]: params.text
        },
        brand: {
          [Op.substring]: params.text
        },
      }
    }
    if (params.max_price) {
      query.price = {
        [Op.between]: [0, +params.max_price]
      }
    }
    if (params.size) {
      query.size_id = +params.size;
    }
    if (params.color) {
      query.color_id = +params.color;
    }
    if (params.category) {
      query.category_id = +params.category;
    }
    return await this.getProducts(query, params);
  }

  async getProductById(id: number) {
    const productEntity = await NewProduct.findOne({where: {is_published: true, id}, include: {
      all: true
    }});
    if (!productEntity) {
      throw new Error("Product with this id doesn't exist");
    }
    return productEntity;
  }

  async getOwnersProducts(userDto: UserDto) {
    const userEntity = await User.findOne({where: {email: userDto.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const productEntities = await Product.findAll({where: {owner_id: userEntity.id}, include: [
        {
          model: Color,
          attributes: ["name"],
        },
        {
          model: Size,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["name"]
        },
        {
          model: ProductImage,
          attributes: ["image_url", "is_main_image"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        }
      ]});
    return productEntities;
  }

  async getProductsByIds(ids: number[]) {
    const products = await Product.findAll({where: {
        id: {
          [Op.in]: ids
        }
      }, include: [
        {
          model: Color,
          attributes: ["name"],
        },
        {
          model: Size,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["name"]
        },
        {
          model: ProductImage,
          attributes: ["image_url", "is_main_image"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        }
      ]});
    return products;
  }

  async createProduct({ productDto, images, mainImage }: { productDto: NewProductDto, mainImage: Express.Multer.File, images: Express.Multer.File[] }, user: UserDto) {
    const userEntity = await User.findOne({where: {email: user.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const {categoryEntity, sizeEntities, colorEntities} = await this.getEntitiesByNames({colors: productDto.colors, sizes: productDto.sizes, category: productDto.category});
    const transaction = await sequelize.startUnmanagedTransaction();
    try {
      //@ts-ignore
      const productEntity = await NewProduct.create({
        ...productDto,
        category_id: categoryEntity.id,
        total_earnings: 0,
        owner_id: userEntity.id,
        time_bought: 0,
      });
      await productEntity.setColors(colorEntities);
      await productEntity.setSizes(sizeEntities);

      const mainImageEntity = await NewProductImage.create({image_url: extractRelativePath(mainImage.path), product_id: productEntity.id, is_main_image: true});
      await mainImageEntity.save();
      if (images || images?.length) {
        for(const image of images) {
          const imageEntity = await NewProductImage.create({image_url: extractRelativePath(image.path), product_id: productEntity.id, is_main_image: false});
          await imageEntity.save();
        }
      }
      await productEntity.save();
      await transaction.commit();
      return {
        ...productDto,
        is_published: productEntity.is_published,
        id: productEntity.id,
        total_earnings: productEntity.total_earnings,
        time_bought: productEntity.time_bought,
        main_image: mainImage.path,
        images: images?.map(image => image.path) || [],
        owner: {
          last_name: userEntity.last_name,
          first_name: userEntity.first_name,
          email: userEntity.email,
        }
      }
    } catch (e) {
      console.log("error",e)
      await transaction.rollback();
      throw new Error(e);
    }
  }

  async updateProduct(product: {id: number, name: string, description: string, price: number, is_published: boolean}, userDto: UserDto) {
    const userEntity = await User.findOne({where: {email: userDto.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const productEntity = await Product.findByPk(product.id);
    if (!productEntity) {
      throw new Error("Product with this id doesn't exist");
    }
    if (productEntity.owner_id !== userEntity.id) {
      throw new Error("Forbidden Error, try to change your products");
    }
    const transaction = await sequelize.startUnmanagedTransaction();
    try {
      productEntity.name = product.name;
      productEntity.description = product.description;
      productEntity.price = product.price;
      productEntity.is_published = product.is_published;
      await productEntity.save();
      await transaction.commit();
      return productEntity;
    } catch (e) {
      await transaction.rollback();
      throw new Error(e);
    }
  }

  async deleteProduct(id: number, userDto: UserDto) {
    const userEntity = await User.findOne({where: {email: userDto.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const productImageEntities = await ProductImage.findAll({where: {product_id: id}});
    for (const image of productImageEntities) {
      await image.destroy();
    }
    const productEntity = await Product.findByPk(id);
    if (!productEntity) {
      throw new Error("Product with this id doesn't exist");
    }
    if (productEntity.owner_id !== userEntity.id) {
      throw new Error("Product doesn't belong you");
    }
    await productEntity.destroy();
  }

  async buyProduct(id: number, times: number) {
    const productEntity = await Product.findByPk(id);
    if (!productEntity) {
      throw new Error("Product with this id doesn't exist");
    }
    productEntity.time_bought += times;
    productEntity.total_earnings += times*productEntity.price;
    await productEntity.save();
  }

  private async getEntitiesByNames({colors, sizes, category}: {colors: string[], sizes: string[], category: number}) {
    const categoryEntity = await Category.findByPk(category);
    if (!categoryEntity) {
      throw new Error("Category doesn't exist");
    }
    const sizeEntities = await Size.findAll({where: {
        name: {
          [Op.in]: sizes
        }
    }});
    const colorEntities = await Color.findAll({where: {
      name: {
        [Op.in]: colors,
      }
    }});
    return {
      categoryEntity,
      sizeEntities,
      colorEntities,
    }
  }
}

export default new ProductV2Service();