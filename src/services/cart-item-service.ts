import {UserDto} from "../dtos/user-dto";
import {User} from "../database/models/user";
import {CartItem} from "../database/models/cart-item";

class CartItemService {
    async getCartItems(userDto: UserDto) {
        const userEntity = await this.getUserEntityFromDto(userDto);
        const cartItemEntities = await CartItem.findAll({where: {user_id: userEntity.id}});
        return cartItemEntities;
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