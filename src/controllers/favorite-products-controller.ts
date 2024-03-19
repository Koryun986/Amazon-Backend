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

    async addFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const favorite = await favoriteProductsService.addFavorite(req.body.id, req.user);
            return res.json(favorite);
        } catch (e) {
            next(e);
        }
    }

    async addFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const favorites = await favoriteProductsService.addFavorites(req.body, req.user);
            return res.json(favorites);
        } catch (e) {
            next(e);
        }
    }

    async removeFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const id = await favoriteProductsService.removeFavorite(+req.params.id, req.user);
            return res.json(id);
        } catch (e) {
            next(e);
        }
    }
}

export default new FavoriteProductsController();