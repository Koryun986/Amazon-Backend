import type {UserDto} from "../dtos/user-dto";
import {FavoriteProduct} from "../database/models/favorite-prodcut";
import {User} from "../database/models/user";

class FavoriteProductsService {
    async getFavorites(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        const favoriteEntities = await FavoriteProduct.findAll({where: {user_id: userEntity.id}});
        return favoriteEntities;
    }
}

export default new FavoriteProductsService();