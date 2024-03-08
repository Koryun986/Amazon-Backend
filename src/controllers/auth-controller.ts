import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator";
import authService from '../services/auth-service';
import { CLIENT_URL, COOKIES_REFRESH_TOKEN } from '../config/envirenmentVariables';
import {getAccessTokenFromBearer} from "../utils/auth-helpers";

class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return new Error("Please provide valid data");
            }
            const data = await authService.createUser(req.body);
            
            res.cookie(COOKIES_REFRESH_TOKEN, data?.refresh_token,  {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authService.login(req.body);
            res.cookie(COOKIES_REFRESH_TOKEN, data?.refresh_token,  {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {            
            const accessToken = getAccessTokenFromBearer(req.headers.authorization!);
            console.log("accessToken",accessToken);
            if (!accessToken) {
                throw new Error("Anauthorized Error");
            }
            const data = await authService.changePassword(req.body, accessToken);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refresh_token} = req.cookies;
            const data = await authService.refresh(refresh_token);
            res.cookie(COOKIES_REFRESH_TOKEN, data?.refresh_token,  {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;
            await authService.activate(activationLink);
            return res.redirect(CLIENT_URL!);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();