import {Router} from "express";
import {authGuard} from "../middlewares/auth-middleware";
import favoriteProductsController from "./../controllers/favorite-products-controller";

const router = Router();

router.get(
    "/",
    authGuard,
    favoriteProductsController.getFavorites
);

export default router;