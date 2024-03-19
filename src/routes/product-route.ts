import {Router} from "express";
import productController from "../controllers/prodcut-controller";
import {authGuard} from "../middlewares/auth-middleware";
import multer from "multer";
import storage from "../config/storage-config";
const router = Router();

const upload = multer({
    storage,
    fileFilter(req, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|avif|webp)$/)) {
            return callback(new Error("Please provide image files"));
        }
        callback(null, true);
    }
});
router.get("", productController.getProducts);
router.get("/:id", productController.getProductById)
router.post(
    "",
    authGuard,
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
    productController.createProduct
);
router.put(
    "",
    authGuard,
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
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