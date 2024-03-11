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
router.put(
    "",
    authGuard,
    productController.updateProduct
);
router.delete(
    "",
    authGuard,
    productController.deleteProduct
);
router.post(
    "/buy",
    authGuard,
    productController.buyProduct
);

export default router;