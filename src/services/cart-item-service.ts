import {User} from "../database/models/user";
import {CartItem} from "../database/models/cart-item";
import type {CartItemDto} from "../dtos/cart-item-dto";
import type {UserDto} from "../dtos/user-dto";

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

    async removeCartItem(id: number, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntity = await CartItem.findOne({where: {product_id: id, user_id: userEntity.id}});
        if (!cartItemEntity) {
            throw new Error("Cart item with this id doesn't exist");
        }
        await cartItemEntity.destroy();
        return cartItemEntity.id;
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