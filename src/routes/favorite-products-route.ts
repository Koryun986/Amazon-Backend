import {Router} from "express";
import {authGuard, authGuardWithoutVerifyingUser} from "../middlewares/auth-middleware";
import favoriteProductsController from "./../controllers/favorite-products-controller";

const router = Router();

router.post(
    "/add-many",
    authGuardWithoutVerifyingUser,
    favoriteProductsController.addFavorites
);

router.use(authGuard);

router.get(
    "/",
    favoriteProductsController.getFavorites
);
router.post(
    "/add",
    favoriteProductsController.addFavorite
);
router.delete(
    "/remove/:id",
    favoriteProductsController.removeFavorite
);

export default router;