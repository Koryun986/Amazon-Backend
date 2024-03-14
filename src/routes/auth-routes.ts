import { Router } from "express";
import { body } from "express-validator";
import authController from "../controllers/auth-controller";
import {adminGuard, authGuard} from "../middlewares/auth-middleware";
import type { MinMaxOptions } from "express-validator/src/options";

const router = Router();

const passwordValidationOptions: MinMaxOptions = {
    min: 3,
    max: 32,
};

router.get(
    "/get-user",
    authGuard,
    authController.getUser
);
router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength(passwordValidationOptions),
    authController.registration,
);
router.post("/login", authController.login);
router.post(
    "/change-password",
    authGuard,
    authController.changePassword
);
router.get("/refresh", authController.refresh);
router.get("/activate/:link", authController.activate);
router.post(
    "/make-admin",
    authGuard,
    adminGuard,
    authController.makeAdmin
);

export default router;