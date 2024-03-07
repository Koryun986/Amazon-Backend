import { Router } from "express";
import { body } from "express-validator";
import type { MinMaxOptions } from "express-validator/src/options";
import authController from "../controllers/auth-controller";

const router = Router();

const passwordValidationOptions: MinMaxOptions = {
    min: 3,
    max: 32,
};

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength(passwordValidationOptions),
    authController.registration,
);
router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);
router.get("/refresh", authController.refresh);
router.get("/activate/:link", authController.activate);

export default router;