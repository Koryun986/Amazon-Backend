import {Router} from "express";
import {authGuard} from "../middlewares/auth-middleware";
import favoriteProductsController from "./../controllers/favorite-products-controller";

const router = Router();

router.use(authGuard);

router.get(
    "/",
    favoriteProductsController.getFavorites
);
router.post(
    "/add",
    favoriteProductsController.addFavorite
);
router.post(
    "/add-many",
    favoriteProductsController.addFavorites
);
router.delete(
    "/remove/:id",
    favoriteProductsController.removeFavorite
);

export default router;