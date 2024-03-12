import {Router} from "express";
import colorController from "./../controllers/color-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("/", colorController.getColors);
router.post(
    "/create",
    authGuard,
    adminGuard,
    colorController.createColor,
);
router.put(
    "/update",
    authGuard,
    adminGuard,
    colorController.updateColor,
);
router.delete(
    "/delete",
    authGuard,
    adminGuard,
    colorController.deleteColor,
);
export default router;