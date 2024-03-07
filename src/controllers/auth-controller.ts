import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator";
import authService from '../services/auth-service';
import { COOKIES_REFRESH_TOKEN } from '../config/envirenmentVariables';

class AuthController {
    private readonly cookiesConfig = {
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        httpOnly: true
    };

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return new Error("Please provide valid data");
            }
            const data = await authService.createUser(req.body);
            res.cookie(COOKIES_REFRESH_TOKEN, data?.refresh_token, this.cookiesConfig);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();