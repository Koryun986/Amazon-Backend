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

export default router;