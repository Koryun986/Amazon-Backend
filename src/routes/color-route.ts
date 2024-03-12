import {Router} from "express";
import colorController from "./../controllers/color-controller";

const router = Router();

router.get("/", colorController.getColors);

export default router;