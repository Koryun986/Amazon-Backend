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
router.get("/get", productController.getProducts);
router.get("/get/:id", productController.getProductById);

router.use(authGuard);

router.get(
    "/account-products",
    productController.getOwnersProducts
);
router.post(
    "/create",
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
    productController.createProduct
);
router.put(
    "/edit",
    productController.updateProduct
);
router.delete(
    "/delete/:id",
    productController.deleteProduct
);
router.post(
    "/buy",
    productController.buyProduct
);

export default router;