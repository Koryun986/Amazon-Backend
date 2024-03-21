import { Request, Response, NextFunction } from 'express';
import tokenService from "./../services/token-service";
import { getAccessTokenFromBearer } from "../utils/auth-helpers";
import { User } from "../database/models/user";
import { Admin } from "../database/models/admin";
import type { UserDto } from "../dtos/user-dto";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("auth", req.url)
        if (!req.headers.authorization) {
            throw new Error("UnAuthorized Error");
        }
        const accessToken = getAccessTokenFromBearer(req.headers.authorization);
        const userDto = tokenService.validateAccessToken(accessToken) as UserDto;
        if (!userDto) {
            throw new Error("UnAuthorized Error");
        }
        const userEntity = await User.findOne({where: {email: userDto.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
        }
        if (!userEntity.is_activated) {
            await userEntity.destroy();
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
            throw new Error("UnAuthorized Error");
        }
        //@ts-ignore
        const userEntity = await User.findOne({where: {email: req.user.email}});
        if (!userEntity) {
            throw new Error("UnAuthorized Error");
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