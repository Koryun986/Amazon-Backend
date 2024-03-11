import bcrypt from "bcrypt";
import {v4} from "uuid";
import { User } from "../database/models/user";
import sequelize from "../database";
import { UserActivationLink } from "../database/models/user-activation-link";
import mailService from "./mail-service";
import { API_URL } from "../config/envirenmentVariables";
import tokenService from "./token-service";
import { Token } from "../database/models/token";
import type { ChangePasswordType, LoginUserType, UserType } from "../types/auth-types";
import type { UserDto } from "../dtos/user-dto";
import {Admin} from "../database/models/admin";

class AuthService {
    async createUser(user: UserType) {
        const transaction = await sequelize.startUnmanagedTransaction();
        const isUserExist = await this.isUserExist(user.email)
        if (isUserExist) {
            throw new Error("User with this email already exists");
        }
        try {
            const hashedPassword = await this.hashPassword(user.password);
            const userEntity = await User.create({...user, password: hashedPassword, is_activated: false, });
            await userEntity.save();

            const activationLink = v4();
            
            const userActivationLinkEntity = await UserActivationLink.create({activation_link: activationLink, user_id: userEntity.id})
            await userActivationLinkEntity.save();
            await mailService.sendActivationMail(user.email, `${API_URL}/auth/activate/${activationLink}`);

            const userDto = this.getUserDtoFromEntity(userEntity);

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
            const {userDto, accessToken, refreshToken} = await this.getTokensAndUserDtoFromUserEntity(userEntity);
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

    async changePassword(changePasswordData: ChangePasswordType, userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        
        const isPasswordsEqual = await bcrypt.compare(changePasswordData.password, userEntity.password);
        if (!isPasswordsEqual) {
            throw new Error("Current password is wrong");
        }
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const hashedNewPassword = await this.hashPassword(changePasswordData.new_password);
            userEntity.password = hashedNewPassword;
            await userEntity.save();
            const {userDto: newUserDto, accessToken, refreshToken} = await this.getTokensAndUserDtoFromUserEntity(userEntity);
            await transaction.commit();
            return {
                ...newUserDto,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (e) {
            await transaction.rollback();
        }
    }

    async refresh(refreshToken: string) {
        const transaction = await sequelize.startUnmanagedTransaction();
        if (!refreshToken) {
            throw new Error("Login to your account");
        }
        const userDto = tokenService.validateRefreshToken(refreshToken);
        const tokenEntity = await Token.findOne({where: {refresh_token: refreshToken}});
        if (!userDto || !tokenEntity) {            
            throw new Error("Login to your account");
        }
        try {
            const userEntity = await User.findByPk(tokenEntity.user_id);
            const validUserDto = this.getUserDtoFromEntity(userEntity!);
            const {accessToken, refreshToken: newRefreshToken} = tokenService.generateTokens(validUserDto);
            tokenEntity.refresh_token = newRefreshToken;
            await transaction.commit();
            return {
                ...validUserDto,
                access_token: accessToken,
                refresh_token: newRefreshToken,
            }
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

    async makeAdmin(newAdminId: number) {
        const isAdminExist = await Admin.findOne({where: {user_id: newAdminId}});
        if (isAdminExist) {
            return;
        }
        const adminEntity = await Admin.create({user_id: newAdminId});
        await adminEntity.save();
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 3);
    }

    private async isUserExist(email: UserDto["email"]) {
        const candidate = await User.findOne({where: {email}});
        return !!candidate;
    }

    private getUserDtoFromEntity(user: User) {
        return {first_name: user.first_name, last_name: user.last_name, email: user.email};
    }

    private async getTokensAndUserDtoFromUserEntity(userEntity: User) {
        const userDto = this.getUserDtoFromEntity(userEntity);
        const {accessToken, refreshToken} = tokenService.generateTokens(userDto);
        const token = await Token.findOne({where: {user_id: userEntity.id}});
        if (!token) {
            const tokenEntity = await Token.create({refresh_token: refreshToken, user_id: userEntity.id});
            await tokenEntity.save();
        } else {
            token.refresh_token = refreshToken;
            await token?.save();
        }
        return {
            userDto,
            accessToken,
            refreshToken,
        };
    }
}

export default new AuthService();