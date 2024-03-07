import bcrypt from "bcrypt";
import uuid from "uuid";
import { User } from "../database/models/user";
import type { UserType } from "../types/auth-types";
import sequelize from "../database";
import { UserActivationLink } from "../database/models/user-activation-link";

class AuthService {
    async createUser(user: UserType) {
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const hashedPassword = await this.hashPassword(user.password);
            const userEntity = await User.create({...user, password: hashedPassword, is_verfied: false});
            await userEntity.save();

            const activationLink = uuid.v4();
            const userActivationLinkEntity = await UserActivationLink.create({activation_link: activationLink, user_id: userEntity.id})
            await userActivationLinkEntity.save();
            
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
        }

    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 3);
    }
}