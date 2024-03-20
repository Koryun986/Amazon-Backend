import {Router} from "express";
import {authGuard} from "../middlewares/auth-middleware";
import cartItemController from "../controllers/cart-item-controller";

const router = Router();

router.get(
    "/",
    authGuard,
    cartItemController.getCartItems
);
router.post(
    "/add/:id",
    authGuard,
    cartItemController.addCartItem
);
router.post(
    "/add-many",
    authGuard,
    cartItemController.addCartItems
);
router.post(
    "/set-item",
    authGuard,
    cartItemController.setCartItem
)
router.delete(
    "/remove/:id",
    authGuard,
    cartItemController.removeCartItem
);

export default router;