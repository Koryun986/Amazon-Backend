import express, {Router} from "express";
import webhookController from "../controllers/webhook-controller";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  webhookController.webhook
);

export default router;
