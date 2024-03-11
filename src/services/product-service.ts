import {Product} from "../database/models/product";
import {Category} from "../database/models/category";
import {Color} from "../database/models/color";
import {Size} from "../database/models/size";
import {User} from "../database/models/user";
import type {ProductDto} from "../dtos/product-dto";
import type {UserDto} from "../dtos/user-dto";

type ProdcutReturnType = ProductDto & {
    id: number;
    total_earnings: number;
    time_bought: number;
    is_published: boolean;
    owner: UserDto;
}

class ProductService {
    async getProducts(): Promise<ProdcutReturnType[]> {
        const products = await Product.findAll();
        if (!products) {
            return [];
        }
        const productsReturnArray: ProdcutReturnType[] = [];
        for(const product of products) {
            if (!product.is_published) {
                continue;
            }
            const categoryEntity = await Category.findByPk(product.category_id);
            const colorEntity = await Color.findByPk(product.color_id);
            const sizeEntity = await Size.findByPk(product.size_id);
            const ownerEntity = await User.findByPk(product.owner_id);
            if (!categoryEntity || !colorEntity || !sizeEntity || !ownerEntity) {
                throw new Error("Something went wrong");
            }
            productsReturnArray.push({
                id: product.id,
                name: product.name,
                description: product.description,
                brand: product.brand,
                price: product.price,
                category: categoryEntity.name,
                color: colorEntity.name,
                size: sizeEntity.name,
                time_bought: product.time_bought,
                is_published: product.is_published,
                total_earnings: product.total_earnings,
                owner: {
                    first_name: ownerEntity.first_name,
                    last_name: ownerEntity.last_name,
                    email: ownerEntity.email
                }
            });
        }
        return productsReturnArray;
    }

    async createProduct(productDto: ProductDto, user: UserDto): Promise<ProdcutReturnType> {
        const userEntity = await User.findOne({where: {email: user.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        const { colorEntity, sizeEntity, categoryEntity } = await this.getEntitiesByNames({color: productDto.color, size: productDto.size, category: productDto.category});
        const productEntity = await Product.create({
            ...productDto,
            color_id: colorEntity.id,
            size_id: sizeEntity.id,
            category_id: categoryEntity.id,
            owner_id: userEntity.id
        });
        await productEntity.save();
        return {
            ...productDto,
            is_published: productEntity.is_published,
            id: productEntity.id,
            total_earnings: productEntity.total_earnings,
            time_bought: productEntity.time_bought,
            owner: {
                last_name: userEntity.last_name,
                first_name: userEntity.first_name,
                email: userEntity.email,
            }
        }
    }

    async updateProduct(product: ProductDto & {id: number}, userDto: UserDto): Promise<ProdcutReturnType> {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        const productEntity = await Product.findByPk(product.id);
        if (!productEntity) {
            throw new Error("Product with this id doesn't exist");
        }
        if (productEntity.owner_id !== userEntity.id) {
            throw new Error("Forbidden Error, try to change your products");
        }
        const { categoryEntity, sizeEntity, colorEntity } = await this.getEntitiesByNames({color: product.color, size: product.size, category: product.category});
        await productEntity.update({
            name: product.name,
            description: product.description,
            brand: product.brand,
            price: product.price,
            category_id: categoryEntity.id,
            size_id: sizeEntity.id,
            color_id: colorEntity.id,
            is_published: !!product?.is_published,
        });
        await productEntity.save();
        return {
            ...product,
            is_published: productEntity.is_published,
            total_earnings: productEntity.total_earnings,
            time_bought: productEntity.time_bought,
            owner: {
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email
            }
        }
    }

    private async getEntitiesByNames({color, size, category}: {color: string, size: string, category: string}) {
        const categoryEntity = await Category.findOne({where: {name: category}});
        if (!categoryEntity) {
            throw new Error("Category doesn't exist");
        }
        const sizeEntity = await Size.findOne({where: {name: size}});
        if (!sizeEntity) {
            throw new Error("Size doesn't exist");
        }
        const colorEntity = await Color.findOne({where: {name: color}});
        if (!colorEntity) {
            throw new Error("Color doesn't exist");
        }
        return {
            categoryEntity,
            sizeEntity,
            colorEntity,
        }
    }
}

export default new ProductService();