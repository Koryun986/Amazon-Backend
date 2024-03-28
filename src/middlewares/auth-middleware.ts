import { Request, Response, NextFunction } from 'express';
import tokenService from "./../services/token-service";
import { getAccessTokenFromBearer } from "../utils/auth-helpers";
import { User } from "../database/models/user";
import { Admin } from "../database/models/admin";
import type { UserDto } from "../dtos/user-dto";
import {ApiError} from "../exceptions/api-error";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("auth", req.url)
        if (!req.headers.authorization) {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = getAccessTokenFromBearer(req.headers.authorization);
        const userDto = tokenService.validateAccessToken(accessToken) as UserDto;
        if (!userDto) {
            throw ApiError.UnauthorizedError();
        }
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        if (!userEntity.is_activated) {
            throw new Error("Your email wasn't activated, please register again");
        }
        //@ts-ignore
        req.user = userDto;
        next();
    } catch (e) {
        next(e);
    }
}

export async function adminGuard(req: Request, res: Response, next: NextFunction) {
    try {
        //@ts-ignore
        if (!req.user) {
            throw ApiError.UnauthorizedError();
        }
        //@ts-ignore
        const userEntity = await User.findOne({where: {email: req.user.email}});
        if (!userEntity) {
            throw ApiError.UnauthorizedError();
        }
        const admin = await Admin.findOne({where: {user_id: userEntity.id}});
        if (!admin) {
            throw new Error("Forbidden exception");
        }
        next();
    } catch (e) {
        next(e);
    }
}