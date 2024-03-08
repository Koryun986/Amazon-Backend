import tokenService from "./token-service";
import {User} from "../database/models/user";
import Address from "../../models/address";
import type {AddressType} from "../types/address-types";
import type{UserDto} from "../dtos/user-dto";
import sequelize from "../database/index";

class AddressService {
    async createAddresses(addresses: AddressType[], accessToken: string) {
        const userDto = tokenService.validateAccessToken(accessToken) as UserDto;
        if (!userDto) {
            throw new Error("UnAuthorized Error");
        }
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        if (!addresses.length) {
            throw new Error("Please provide addresses");
        }
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            for(const address of addresses) {
                const addressEntity = await Address.create({
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    zip_code: address.zip_code,
                    street_address: address.street_address,
                    is_default_address: address?.is_default_address ? address.is_default_address : false,
                    user_id: userEntity.id,
                });
                await addressEntity.save();
            }
            await transaction.commit();
            return addresses;
        } catch (e) {
            await transaction.rollback();
        }
    }
}

export default new AddressService();