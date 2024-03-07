import bcrypt from "bcrypt";
import uuid from "uuid";
import { User } from "../database/models/user";
import type { UserType } from "../types/auth-types";
import sequelize from "../database";
import { UserActivationLink } from "../database/models/user-activation-link";
import mailService from "./mail-service";
import { API_URL } from "../config/envirenmentVariables";
import tokenService from "./token-service";
import { Token } from "../database/models/token";
import { UserDto } from "../dtos/user-dto";

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
            await mailService.sendActivationMail(user.email, `${API_URL}/auth/activate/${activationLink}`);

            const userDto: UserDto = {email: user.email, last_name: user.last_name, first_name: user.first_name};

            const {accessToken, refreshToken} = tokenService.generateTokens(userDto);
            const tokenEntity = await Token.create({refresh_token: refreshToken, user_id: userEntity.id});
            await tokenEntity.save();

            await transaction.commit();
            return {
                ...userDto,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (e) {
            await transaction.rollback();
        }

    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 3);
    }
}

export default new AuthService();