import bcrypt from "bcrypt";
import {v4} from "uuid";
import { User } from "../database/models/user";
import sequelize from "../database";
import { UserActivationLink } from "../database/models/user-activation-link";
import mailService from "./mail-service";
import { API_URL } from "../config/envirenmentVariables";
import tokenService from "./token-service";
import { Token } from "../database/models/token";
import type { LoginUserType, UserType } from "../types/auth-types";
import type { UserDto } from "../dtos/user-dto";

class AuthService {
    async createUser(user: UserType) {
        const transaction = await sequelize.startUnmanagedTransaction();
        const isUserExist = await this.isUserExist(user.email)
        if (isUserExist) {
            throw new Error("User with this email already exists");
        }
        try {
            const hashedPassword = await this.hashPassword(user.password);
            const userEntity = await User.create({...user, password: hashedPassword, is_verfied: false});
            await userEntity.save();

            const activationLink = v4();
            console.log(activationLink);
            
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
            console.log(e);
            
            await transaction.rollback();
        }
    }

    async login(user: LoginUserType) {
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const userEntity = await User.findOne({where: {email: user.email}});
            if (!userEntity) {
                throw new Error("User with this email doesn't exist");
            }
            const isPasswordsEqual = await bcrypt.compare(user.password, userEntity.password);
            if (!isPasswordsEqual) {
                throw new Error("Password isn't correct");
            }
            const userDto: UserDto = {first_name: userEntity.first_name, last_name: userEntity.last_name, email: userEntity.email};
            const {accessToken, refreshToken} = tokenService.generateTokens(userDto);
            const token = await Token.findOne({where: {user_id: userEntity.id}});
            if (!token) {
                const tokenEntity = await Token.create({refresh_token: refreshToken, user_id: userEntity.id});
                await tokenEntity.save();
            } else {
                token.refresh_token = refreshToken;
                await token?.save();
            }

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

    async activate(activationLink: string) {
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const userActivationLinkEntity = await UserActivationLink.findOne({where: {activation_link: activationLink}});
            const userEntity = await User.findByPk(userActivationLinkEntity?.id);
            userEntity!.is_activated = true;
            await userEntity?.save()
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
        }
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 3);
    }

    private async isUserExist(email: UserDto["email"]) {
        const candidate = await User.findOne({where: {email}});
        return !!candidate;
    }
}

export default new AuthService();