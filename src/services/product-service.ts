import {Op} from "@sequelize/core";
import sequelize from "../database";
import stripeService from "./stripe-service";
import {Product} from "../database/models/product";
import {Category} from "../database/models/category";
import {Color} from "../database/models/color";
import {Size} from "../database/models/size";
import {User} from "../database/models/user";
import {ProductImage} from "../database/models/product-images";
import {extractRelativePath} from "../utils/file-helpers";
import {ProductParams} from "../types/product-params-type";
import {ApiError} from "../exceptions/api-error";
import type {ProductDto} from "../dtos/product-dto";
import type {UserDto} from "../dtos/user-dto";
import {CartItem} from "../database/models/cart-item";
import {StripeCustomer} from "../database/models/stripe-customer";

class ProductService {
    async getProducts(params: any = {}, includeWhereParams: {color: any, size: any} = {color: {}, size: {}}, pagination?: {limit?: string, page?: string}) {
        const limit = +pagination?.limit || 8;
        const offset = pagination?.page ? (+pagination.page - 1) * limit : 0;
        const {rows, count} = await Product.findAndCountAll({where: {is_published: true, ...params}, limit, offset, include: [
            {
                model: Color,
                where: includeWhereParams?.color || {},
            },
            {
                model: Size,
                where: includeWhereParams?.size || {},
            },
            {
                association: "images"
            },
            {
                association: "main_image"
            },
            Category, User
        ], distinct: true});
        return {count, products: rows};
    }

    async getProductsByParams(params: ProductParams) {
        const {query, includeWhereParams} = await this.getParams(params);
        return await this.getProducts(query, includeWhereParams, params);
    }

    async getParams(params: ProductParams) {
        const query: any = {};
        const includeWhereParams: any = {};
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
            const sizes = params.size.split(",");
            includeWhereParams.size = {
                id: {
                    [Op.in]: sizes
                }
            }
        }
        if (params.color) {
            const colors = params.color.split(",");
            includeWhereParams.color = {
                id: {
                    [Op.in]: colors
                }
            }
        }
        if (params.category) {
            const allChildIds = await this.getAllChildCategoryIdsById(+params.category);
            query.category_id = {
                [Op.in]: [+params.category, ...allChildIds]
            };
        }
        return {
            query,
            includeWhereParams
        }
    }

    async getProductById(id: number) {
        const productEntity = await Product.findOne({where: {is_published: true, id}, include: {
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
        const productEntities = await Product.findAll({where: {owner_id: userEntity.id}, include: {
                all: true,
            }});
        return productEntities;
    }

    async getProductsByIds(ids: number[], params: any = {}, includeWhereParams: {color: any, size: any} = {color: {}, size: {}}) {
        const products = await Product.findAll({where: {
                ...params,
                id: {
                    [Op.in]: ids
                }
            },
            include: [
                {
                    model: Color,
                    where: includeWhereParams?.color || {},
                },
                {
                    model: Size,
                    where: includeWhereParams?.size || {},
                },
                {
                    association: "images"
                },
                {
                    association: "main_image"
                },
                Category, User
            ]});
        return products;
    }

    async createProduct({ productDto, images, mainImage }: { productDto: ProductDto, mainImage: Express.Multer.File, images: Express.Multer.File[] }, user: UserDto) {
        const userEntity = await User.findOne({where: {email: user.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const {categoryEntity, sizeEntities, colorEntities} = await this.getEntitiesByNames({colors: productDto.colors, sizes: productDto.sizes, category: productDto.category});
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            //@ts-ignore
            const productEntity = await Product.create({
                ...productDto,
                category_id: categoryEntity.id,
                total_earnings: 0,
                owner_id: userEntity.id,
                time_bought: 0,
            });
            await productEntity.setColors(colorEntities);
            await productEntity.setSizes(sizeEntities);

            const mainImageEntity = await ProductImage.create({image_url: extractRelativePath(mainImage.path), product_id: productEntity.id, is_main_image: true});
            await mainImageEntity.save();
            if (images || images?.length) {
                for(const image of images) {
                    const imageEntity = await ProductImage.create({image_url: extractRelativePath(image.path), product_id: productEntity.id, is_main_image: false});
                    await imageEntity.save();
                }
            }
            await stripeService.createProduct(productEntity.id, productDto.price, productDto.is_published);
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
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async updateProduct(product: {id: number, name: string, description: string, price: number, colors: string[], sizes: string[], category: number, is_published: boolean}, userDto: UserDto) {
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
            const colorEntities = await Color.findAll({where: {
                name: {
                    [Op.in]: product.colors
                }
            }});
            const sizeEntities = await Size.findAll({where: {
                name: {
                    [Op.in]: product.sizes
                }
            }});
            const categoryEntity = await Category.findByPk(product.category);
            if (!categoryEntity) {
                throw ApiError.BadRequest("Category with this id doesn't exist");
            }
            if (product.price !== productEntity.price) {
                await stripeService.updateProduct(product.id, product.price, product.is_published);
            } else if (product.is_published !== productEntity.is_published) {
                await stripeService.changeProductStatus(product.id, product.is_published);
            }
            productEntity.name = product.name;
            productEntity.description = product.description;
            productEntity.price = product.price;
            productEntity.is_published = product.is_published;
            productEntity.category_id = categoryEntity.id;
            await productEntity.setColors(colorEntities);
            await productEntity.setSizes(sizeEntities);
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
        const productEntity = await Product.findByPk(id);
        if (!productEntity) {
            throw new Error("Product with this id doesn't exist");
        }
        if (productEntity.owner_id !== userEntity.id) {
            throw new Error("Product doesn't belong you");
        }
        await stripeService.deleteProduct(id);
        await productEntity.destroy();
    }

    async buyProductClientSecret(id: number, count: number, userDto: UserDto, payment_id?: string) {
        if (payment_id) {
            await stripeService.removeProductFromPayment(payment_id, id);
        }
        const productEntity = await Product.findByPk(id, {
            include: {all: true},
        });
        if (!productEntity) {
            throw new Error("Product with this id doesn't exist");
        }
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const customerEntity = await StripeCustomer.findOne({where: {user_id: userEntity.id}});
        const stripeSession = await stripeService.buyProduct(productEntity.price * count, [{id, count}], customerEntity.stripe_customer_id);
        return {
            product: productEntity,
            amount: stripeSession.amount,
            clientSecret: stripeSession.client_secret
        };
    }

    async buyAllCartItemsCheckout(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const cartItems = await CartItem.findAll({
            where: {
                user_id: userEntity.id
            },
        });
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: cartItems.map(item => item.product_id)
                }
            },
            include: {
              all: true
            },
        });
        const amount = products.reduce((acc, cur) => {
            const cartItem = cartItems.find(item => item.product_id === cur.id);
            if (!cartItem) {
                throw new Error("Something went wrong");
            }
            return acc + cur.price * cartItem.count;
        }, 0);
        const productInfos = products.map(product => {
            const cartItem = cartItems.find(item => item.product_id === product.id);
            if (!cartItem) {
                return {...product, count: 0}
            }
            return {id:product.id, count: cartItem.count};
        });
        const customerEntity = await StripeCustomer.findOne({where: {user_id: userEntity.id}});
        const stripeSession = await stripeService.buyProduct(amount, productInfos ,customerEntity.stripe_customer_id);
        return {
            clientSecret: stripeSession.client_secret,
            amount: stripeSession.amount,
            products,
            cartItems
        }
    }

    async getPayments(userDto: UserDto) {
        const productInfos = await stripeService.getCustomerPayedProducts(userDto);
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: productInfos.map(productInfo => productInfo.id),
                }
            },
            include: {
                all: true,
            }
        });
        return {
            products,
            info: productInfos
        }
    }

    async getOrders(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const stripeCustomerEntity = await StripeCustomer.findOne({where: {user_id: userEntity.id}});
        const productInfos = await stripeService.getCustomersOrderedProducts(stripeCustomerEntity.stripe_customer_id);
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: productInfos.map(productInfo => productInfo.id),
                }
            },
            include: {
                all: true,
            }
        });
        return {
            products,
            info: productInfos
        }
    }

    async tryPaymentAgain(paymentId: string) {
        const paymentIntent = await stripeService.getPaymentById(paymentId);
        const products = JSON.parse(paymentIntent.metadata.products);
        const productEntities = await Product.findAll({where: {
            id: {
                [Op.in]: products.map(product => product.id)
            }
        }, include: {all: true}});
        return {
            clientSecret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            products: productEntities,
            cartItems: products.map(product => ({...product, product_id: product.id}))
        };
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

    private async getAllChildCategoryIdsById(id: number) {
        const categories = await Category.findAll({where: {parent_id: id}});
        if (!categories.length) {
            return [];
        }
        const childCategoryIds = categories.map(category => category.id);
        for(const category of categories) {
            childCategoryIds.push(...(await this.getAllChildCategoryIdsById(category.id)));
        }
        return childCategoryIds;
    }
}

export default new ProductService();
