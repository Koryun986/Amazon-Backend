import {Router} from "express";
import {authGuard, authGuardWithoutVerifyingUser} from "../middlewares/auth-middleware";
import cartItemController from "../controllers/cart-item-controller";

const router = Router();

router.post(
    "/add-many",
    authGuardWithoutVerifyingUser,
    cartItemController.addCartItems
);

router.use(authGuard);

router.get(
    "/",
    cartItemController.getCartItems
);
router.post(
    "/add/:id",
    cartItemController.addCartItem
);
router.post(
    "/set-item",
    cartItemController.setCartItem
)
router.delete(
    "/remove/:id",
    cartItemController.removeCartItem
);

export default router;