import {Router} from "express";
import productController from "../controllers/prodcut-controller";
import {authGuard} from "../middlewares/auth-middleware";
const router = Router();

router.get("", productController.getProducts);
router.post(
    "",
    authGuard,
    productController.createProduct
);

export default router;