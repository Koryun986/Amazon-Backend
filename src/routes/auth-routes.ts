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

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength(passwordValidationOptions),
    authController.registration,
);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.get("/activate/:link", authController.activate);

router.use(authGuard);

router.get(
    "/get-user",
    authController.getUser
);
router.post(
    "/change-password",
    authController.changePassword
);

router.use(adminGuard);

router.get(
  "/get-users",
  authController.getUsers
)

router.post(
    "/make-admin",
    authController.makeAdmin
);

export default router;