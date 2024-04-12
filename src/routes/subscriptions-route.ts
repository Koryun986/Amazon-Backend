import {Router} from "express";
import subscriptionController from "../controllers/subscription-controller";
import {authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.use(authGuard);

router.post(
  "/product",
  subscriptionController.subscribeProduct
);

export default router;
