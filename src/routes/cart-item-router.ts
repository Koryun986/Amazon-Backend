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
    "/add",
    authGuard,
    cartItemController.addCartItem
);
router.delete(
    "/remove",
    authGuard,
    cartItemController.removeCartItem
);

export default router;