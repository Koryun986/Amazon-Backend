import sequelize from "../database";
import {FavoriteProduct} from "../database/models/favorite-prodcut";
import {User} from "../database/models/user";
import type {UserDto} from "../dtos/user-dto";

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

    async addFavorites(ids: number[], userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const favoriteEntities = [];
            for(const id of ids) {
                const favoriteEntity = await FavoriteProduct.create({user_id: userEntity.id, product_id: id});
                await favoriteEntity.save();
                favoriteEntities.push(favoriteEntity);
            }
            await transaction.commit();
            return favoriteEntities;
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async removeFavorite(id: number, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const favoriteEntity = await FavoriteProduct.findOne({where: {product_id: id, user_id: userEntity.id}});
        await favoriteEntity.destroy();
        return favoriteEntity.id;
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