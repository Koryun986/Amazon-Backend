import { Request, Response, NextFunction } from "express";
import favoriteProductsService from "./../services/favorite-products-service";

class FavoriteProductsController {
    async getFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const favorites = await favoriteProductsService.getFavorites(req.user);
            return res.json(favorites);
        } catch (e) {
            next(e);
        }
    }
}

export default new FavoriteProductsController();