import { Request, Response, NextFunction } from 'express';
import tokenService from "./../services/token-service";
import {getAccessTokenFromBearer} from "../utils/auth-helpers";
import {User} from "../database/models/user";
import {Admin} from "../database/models/admin";

export function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) {
            throw new Error("UnAuthorized Error");
        }
        const accessToken = getAccessTokenFromBearer(req.headers.authorization);
        const userDto = tokenService.validateAccessToken(accessToken);
        if (!userDto) {
            throw new Error("UnAuthorized Error");
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