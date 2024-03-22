import sequelize from "../database";
import {User} from "../database/models/user";
import {CartItem} from "../database/models/cart-item";
import type {CartItemDto} from "../dtos/cart-item-dto";
import type {UserDto} from "../dtos/user-dto";
import {ApiError} from "../exceptions/api-error";

class CartItemService {
    async getCartItems(userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntities = await CartItem.findAll({where: {user_id: userEntity.id}});
        return cartItemEntities;
    }

    async addCartItem(productId: number, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        let cartItemEntity = await CartItem.findOne({where: {user_id: userEntity.id, product_id: productId}});
        if (!cartItemEntity) {
            cartItemEntity = await CartItem.create({count: 0, user_id: userEntity.id, product_id: productId});
        } else {
            cartItemEntity.count++;
        }
        await cartItemEntity.save();
        return cartItemEntity;
    }

    async addCartItems(cartItemDtos: CartItemDto[], userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntities = [];
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            for(const cartItemDto of cartItemDtos) {
                const cartItemEntity = await CartItem.create({count: cartItemDto.count, user_id: userEntity.id, product_id: cartItemDto.product_id});
                await cartItemEntity.save();
                cartItemEntities.push(cartItemEntity);
            }
            await transaction.commit();
            return cartItemEntities;
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async setCartItem(cartItemDto: CartItemDto, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        let cartItem = await CartItem.findOne({where: {user_id: userEntity.id, product_id: cartItemDto.product_id}});
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            if (cartItem) {
                if (!cartItemDto.count) {
                    await cartItem.destroy();
                } else if (cartItemDto.count !== cartItem.count) {
                    cartItem.count = cartItemDto.count;
                    await cartItem.save();
                }
            } else {
                if (cartItemDto.count) {
                    cartItem = await CartItem.create({count: cartItemDto.count, product_id: cartItemDto.product_id, user_id: userEntity.id});
                    await cartItem.save();
                }
            }
            await transaction.commit();
            return cartItem;
        } catch (e) {
            await transaction.rollback();
        }
    }

    async removeCartItem(id: number, userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntity = await CartItem.findOne({where: {product_id: id, user_id: userEntity.id}});
        if (!cartItemEntity) {
            throw new Error("Cart item with this id doesn't exist");
        }
        if (!cartItemEntity.count) {
            await cartItemEntity.destroy();
        } else {
            cartItemEntity.count--;
            await cartItemEntity.save();
        }
        return cartItemEntity.id;
    }

    private async getUserEntityFromDto(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        return userEntity;
    }
}

export default new CartItemService();