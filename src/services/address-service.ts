import sequelize from "../database/index";
import {User} from "../database/models/user";
import {Address} from "../../models/address";
import type {AddressType} from "../types/address-types";
import type {UserDto} from "../dtos/user-dto";

class AddressService {
    async createAddresses(addresses: AddressType[], userDto: UserDto) {
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

    async getAddresses(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        const addressEntities: Address[] = await Address.findAll({where: {user_id: userEntity.id}});
        if (!addressEntities) {
            return [];
        }
        const addresses: AddressType[] = addressEntities.map(addressEntity => ({
            country: addressEntity.country,
            state: addressEntity.state,
            city: addressEntity.city,
            zip_code: addressEntity.zip_code,
            street_address: addressEntity.street_address,
            is_default_address: addressEntity.is_default_address
        }));
        return addresses;
    }
}

export default new AddressService();