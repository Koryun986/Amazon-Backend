import {Product} from "../database/models/product";
import {Category} from "../database/models/category";
import {Color} from "../database/models/color";
import {Size} from "../database/models/size";
import {User} from "../database/models/user";

class ProductService {
    async getProducts() {
        const products = await Product.findAll();
        if (!products) {
            return [];
        }
        const productsReturnArray = []
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
}

export default new ProductService();