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

router.post(
    "/test-create",
    authGuard,
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
    productController.testCreate
);

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