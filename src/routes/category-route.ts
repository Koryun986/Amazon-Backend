import {Router} from "express";
import categoryController from "./../controllers/category-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/", authGuard, adminGuard, categoryController.createCategory);
router.put("/", authGuard, adminGuard, categoryController.updateCategory);

export default router;