import {Router} from "express";
import sizeController from "./../controllers/size-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.get("", sizeController.getSizes);

router.use(authGuard);
router.use(adminGuard);

router.post(
"/create",
    sizeController.createSize
);
router.put(
    "/update",
    sizeController.updateSize
);
router.delete(
    "/delete/:id",
    sizeController.deleteSize
);
export default router;
