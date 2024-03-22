import {Router} from "express";
import colorController from "./../controllers/color-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("/", colorController.getColors);

router.use(authGuard);
router.use(adminGuard);

router.post(
    "/create",
    colorController.createColor,
);
router.put(
    "/update",
    colorController.updateColor,
);
router.delete(
    "/delete/:id",
    colorController.deleteColor,
);
export default router;