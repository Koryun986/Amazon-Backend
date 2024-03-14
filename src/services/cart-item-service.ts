import {UserDto} from "../dtos/user-dto";
import {User} from "../database/models/user";
import {CartItem} from "../database/models/cart-item";
import {FavoriteProduct} from "../database/models/favorite-prodcut";
import {CartItemDto} from "../dtos/cart-item-dto";

class CartItemService {
    async getCartItems(userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntities = await CartItem.findAll({where: {user_id: userEntity.id}});
        return cartItemEntities;
    }

    async addCartItem(cartItemDto: CartItemDto, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntity = await CartItem.create({count: cartItemDto.count, user_id: userEntity.id, product_id: cartItemDto.product_id});
        await cartItemEntity.save();
        return cartItemEntity;
    }

    private async getUserEntityFromDto(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        return userEntity;
    }
}

export default new CartItemService();