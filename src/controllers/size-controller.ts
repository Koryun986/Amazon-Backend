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
}

export default new SizeController();