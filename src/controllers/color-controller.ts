import {NextFunction, Request, Response} from "express";
import colorService from "./../services/color-service";

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

    async updateColor(req: Request, res: Response, next: NextFunction) {
        try {
            const color = await colorService.updateColor(req.body);
            return res.json(color);
        } catch (e) {
            next(e);
        }
    }

    async deleteColor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = await colorService.deleteColor(req.body.id);
            return res.json(id);
        } catch (e) {
            next(e);
        }
    }
}

export default new ColorController();