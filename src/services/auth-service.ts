import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { User } from "../database/models/user";
import sequelize from "../database";
import { UserActivationLink } from "../database/models/user-activation-link";
import mailService from "./mail-service";
import { API_URL } from "../config/envirenmentVariables";
import tokenService from "./token-service";
import stripeService from "./stripe-service";
import { Token } from "../database/models/token";
import { Admin } from "../database/models/admin";
import type { ChangePasswordType, LoginUserType, UserType } from "../types/auth-types";
import type { UserDto } from "../dtos/user-dto";
import {ApiError} from "../exceptions/api-error";
import {Op} from "@sequelize/core";
import {StripeCustomer} from "../database/models/stripe-customer";

class AuthService {
    async createUser(user: UserType) {
        const isUserExist = await this.isUserExist(user.email);
        if (isUserExist) {
            throw new Error("User with this email already exists");
        }
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            const hashedPassword = await this.hashPassword(user.password);
            const userEntity = await User.create({...user, password: hashedPassword, is_activated: false, });
            await userEntity.save();
            const activationLink = v4();

            const userActivationLinkEntity = await UserActivationLink.create({activation_link: activationLink, user_id: userEntity.id})
            await userActivationLinkEntity.save();
            await mailService.sendActivationMail(user.email, `${API_URL}/auth/activate/${userActivationLinkEntity.activation_link}`);

            const userDto = this.getUserDtoFromEntity(userEntity);

            const {accessToken, refreshToken} = tokenService.generateTokens(userDto);
            const tokenEntity = await Token.create({refresh_token: refreshToken, user_id: userEntity.id});
            await tokenEntity.save();

            const stripeCustomer = await stripeService.createCustomer(userDto);
            const stripeCustomerEntity = await StripeCustomer.create({stripe_customer_id: stripeCustomer.id, user_id: userEntity.id});
            await stripeCustomerEntity.save();

            await transaction.commit();
            return {
                ...userDto,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
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
            throw new Error(e);
        }
    }

    async changePassword(changePasswordData: ChangePasswordType, userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
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
            console.log(userEntity, "user")
            return {
                ...newUserDto,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new Error("Login to your account");
        }
        const userDto = tokenService.validateRefreshToken(refreshToken);
        const tokenEntity = await Token.findOne({where: {refresh_token: refreshToken}});
        if (!userDto || !tokenEntity) {
            throw new Error("Login to your account");
        }
        const transaction = await sequelize.startUnmanagedTransaction();
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
            throw new Error(e);
        }
    }

    async activate(activationLink: string) {
        const transaction = await sequelize.startUnmanagedTransaction();
        try {
            console.log()
            const userActivationLinkEntity = await UserActivationLink.findOne({where: {activation_link: activationLink}});
            if (!userActivationLinkEntity) {
                throw new Error("Your activation link is not found");
            }
            const userEntity = await User.findByPk(userActivationLinkEntity.user_id);
            if (!userEntity) {
                throw new Error("Your account doesn't found");
            }
            userEntity.is_activated = true;
            await userEntity?.save()
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }

    async makeAdmin(email: string) {
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.BadRequest("User with this email doesn't exist");
        }
        const isAdminExist = await Admin.findOne({where: {user_id: user.id}});
        if (isAdminExist) {
            return;
        }
        const adminEntity = await Admin.create({user_id: user.id});
        await adminEntity.save();
    }

    async getUser(userDto: UserDto) {
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const {userDto: user, accessToken, refreshToken} = await this.getTokensAndUserDtoFromUserEntity(userEntity);
        const isAdmin = await Admin.findOne({where: {user_id: userEntity.id}});
        return {
            ...user,
            access_token: accessToken,
            refresh_token: refreshToken,
            isAdmin: !!isAdmin,
        }
    }

    async getUsers() {
        const admins = (await Admin.findAll()).map(admin => admin.user_id);
        const users = await User.findAll({
            where: {
                [Op.not]: {
                    id: {
                            [Op.in]: admins
                        }
                    }
                }
            }
        );
        return users;
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
