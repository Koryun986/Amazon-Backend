import colorService from "./../services/color-service";
import {NextFunction, Request, Response} from "express";

class ColorController {
    async getColors(req: Request, res: Response, next: NextFunction) {
        try {
            const colors = await colorService.getColors();
            return res.json(colors);
        } catch (e) {
            next(e);
        }
    }

    async createColor(req: Request, res: Response, next: NextFunction) {
        try {
            const color = await colorService.createColor(req.body.name);
            return res.json(color);
        } catch (e) {
            next(e);
        }
    }
}

export default new ColorController();