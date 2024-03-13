import type {UserDto} from "../dtos/user-dto";
import {FavoriteProduct} from "../database/models/favorite-prodcut";
import {User} from "../database/models/user";

class FavoriteProductsService {
    async getFavorites(userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const favoriteEntities = await FavoriteProduct.findAll({where: {user_id: userEntity.id}});
        return favoriteEntities;
    }

    async addFavorite(id: number, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const favoriteEntity = await FavoriteProduct.create({user_id: userEntity.id, product_id: id});
        await favoriteEntity.save();
        return favoriteEntity;
    }

    private async getUserEntityFromDto(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        return userEntity;
    }
}

export default new FavoriteProductsService();