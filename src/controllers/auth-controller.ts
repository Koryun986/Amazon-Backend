import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator";
import authService from '../services/auth-service';

class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return new Error("Please provide valid data");
            }
            const data = await authService.createUser(req.body);

            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();