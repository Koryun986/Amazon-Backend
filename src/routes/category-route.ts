import {Router} from "express";
import categoryController from "./../controllers/category-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("/", categoryController.getCategories);

router.use(authGuard);
router.use(adminGuard);

router.post("/create", categoryController.createCategory);
router.put("/update", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

export default router;