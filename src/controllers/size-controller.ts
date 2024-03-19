import { Request, Response, NextFunction } from "express";
import sizeService from "./../services/size-service";

class SizeController {
    async getSizes(req: Request, res: Response, next: NextFunction) {
        try {
            const sizes = await sizeService.getSizes();
            return res.json(sizes);
        } catch (e) {
            next(e);
        }
    }

    async createSize(req: Request, res: Response, next: NextFunction) {
        try {
            const size = await sizeService.createSize(req.body.name);
            return res.json(size);
        } catch (e) {
            next(e);
        }
    }

    async updateSize(req: Request, res: Response, next: NextFunction) {
        try {
            const size = await sizeService.updateSize(req.body);
            return res.json(size);
        } catch (e) {
            next(e);
        }
    }

    async deleteSize(req: Request, res: Response, next: NextFunction) {
        try {
            const id = await sizeService.deleteSize(+req.params.id);
            return res.json(id);
        } catch (e) {
            next(e);
        }
    }
}

export default new SizeController();