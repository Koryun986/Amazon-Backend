import {Router} from "express";
import subscriptionController from "../controllers/subscription-controller";
import {authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.use(authGuard);

router.post(
  "/product",
  subscriptionController.subscribeProduct
);
router.get(
  "/get-products",
  subscriptionController.getSubscriptionsOfProduct
);
router.delete(
  "/cancel/:product_id",
  subscriptionController.cancelSubscription
)

export default router;
