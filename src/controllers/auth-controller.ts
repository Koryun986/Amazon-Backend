import {Request, Response, NextFunction, CookieOptions} from 'express';
import { validationResult } from "express-validator";
import authService from '../services/auth-service';
import { CLIENT_URL, COOKIES_REFRESH_TOKEN } from '../config/envirenmentVariables';

class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return new Error("Please provide valid data");
            }
            console.log("body", req.body)
            const data = await authService.createUser(req.body);
            res.cookie(COOKIES_REFRESH_TOKEN, data?.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
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
            //@ts-ignore
            const data = await authService.changePassword(req.body, req.user);
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

    async makeAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.makeAdmin(req.body.id);
            return res.json();
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();