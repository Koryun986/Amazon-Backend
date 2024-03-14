import {Router} from "express";
import {authGuard} from "../middlewares/auth-middleware";
import cartItemController from "../controllers/cart-item-controller";

const router = Router();

router.get(
    "/",
    authGuard,
    cartItemController.getCartItems
);

export default router;