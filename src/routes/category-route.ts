import {Router} from "express";
import categoryController from "./../controllers/category-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/create", authGuard, adminGuard, categoryController.createCategory);
router.put("/update", authGuard, adminGuard, categoryController.updateCategory);
router.delete("/delete/:id", authGuard, adminGuard, categoryController.deleteCategory);

export default router;