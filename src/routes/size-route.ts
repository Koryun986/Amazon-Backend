import {Router} from "express";
import sizeController from "./../controllers/size-controller";

const router = Router();

router.get("", sizeController.getSizes);

export default router;