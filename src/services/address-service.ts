import sequelize from "../database/index";
import { User } from "../database/models/user";
import { Address } from "../database/models/address";
import type { AddressType } from "../types/address-types";
import type { UserDto } from "../dtos/user-dto";
import {userInfo} from "os";
import {ApiError} from "../exceptions/api-error";

type AddressReturnType = AddressType & { id: number };

class AddressService {
    async createAddress(address: AddressType, userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        if (address.is_default_address) {
            await this.changeDefaultAddressesToNormal(userEntity.id);
        }
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
        return addressEntity;
    }

    async getAddresses(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const addressEntities: Address[] = await Address.findAll({where: {user_id: userEntity.id}});
        if (!addressEntities) {
            return [];
        }
        const addresses: AddressReturnType[] = addressEntities.map(addressEntity => ({
            id: addressEntity.id,
            country: addressEntity.country,
            state: addressEntity.state,
            city: addressEntity.city,
            zip_code: addressEntity.zip_code,
            street_address: addressEntity.street_address,
            is_default_address: addressEntity.is_default_address
        }));
        return addresses;
    }

    async updateAddress(address: AddressReturnType) {
        const addressEntity = await Address.findByPk(address.id);
        if (!addressEntity) {
            throw new Error("Address with this id not found");
        }
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            if (address.is_default_address && !addressEntity.is_default_address) {
                await this.changeDefaultAddressesToNormal(addressEntity.user_id);
            }
            await addressEntity.update({...address});
            await addressEntity.save();
            await transaction.commit();
            return address;
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async deleteAddress(id: number) {
        const addressEntity = await Address.findByPk(id);
        if (!addressEntity) {
            throw new Error("Address with this id not found");
        }
        await addressEntity.destroy();
    }

    private async changeDefaultAddressesToNormal(userId: number) {
        const defaultAddresses = await Address.findAll({where: {user_id: userId, is_default_address: true}});
        if (defaultAddresses.length) {
            for(const defaultAddress of defaultAddresses) {
                defaultAddress.is_default_address = false;
                await defaultAddress.save();
            }
        }
    }
}

export default new AddressService();