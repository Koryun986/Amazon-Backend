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
router.put(
    "/update",
    authGuard,
    adminGuard,
    sizeController.updateSize
);
router.delete(
    "/delete",
    authGuard,
    adminGuard,
    sizeController.deleteSize
);
export default router;
