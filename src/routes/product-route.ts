import {Router} from "express";
import productController from "../controllers/prodcut-controller";
const router = Router();

router.get("", productController.getProducts);

export default router;