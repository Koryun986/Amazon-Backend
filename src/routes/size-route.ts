import {Router} from "express";
import sizeController from "./../controllers/size-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("", sizeController.getSizes);
router.post(
"/create",
    authGuard,
    adminGuard,
    sizeController.createSize
);
export default router;