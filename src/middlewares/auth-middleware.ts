import { Request, Response, NextFunction } from 'express';
import tokenService from "./../services/token-service";
import {getAccessTokenFromBearer} from "../utils/auth-helpers";

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