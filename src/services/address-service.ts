import sequelize from "../database/index";
import { User } from "../database/models/user";
import { Address } from "../database/models/address";
import type { AddressType } from "../types/address-types";
import type { UserDto } from "../dtos/user-dto";

type AddressReturnType = AddressType & { id: number };

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
            const addressReturnObjects: Array<AddressReturnType> = [];
            for(const address of addresses) {
                const addressEntity = await this.createAddress(address, userEntity.id);
                addressReturnObjects.push({...address, is_default_address: addressEntity.is_default_address, id: addressEntity.id});
            }
            await transaction.commit();
            return addressReturnObjects;
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
        await addressEntity.update({...address});
        await addressEntity.save();
        return address;
    }

    async deleteAddress(id: number) {
        const addressEntity = await Address.findByPk(id);
        if (!addressEntity) {
            throw new Error("Address with this id not found");
        }
        await addressEntity.destroy();
    }

    private async createAddress(address: AddressType, userId: number) {
        const addressEntity = await Address.create({
            country: address.country,
            state: address.state,
            city: address.city,
            zip_code: address.zip_code,
            street_address: address.street_address,
            is_default_address: address?.is_default_address ? address.is_default_address : false,
            user_id: userId,
        });
        await addressEntity.save();
        return addressEntity;
    }

}

export default new AddressService();