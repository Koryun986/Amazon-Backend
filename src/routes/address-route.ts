import {Router} from "express";
import addressController from "./../controllers/address-controller";
import {authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.post(
    "/create-addresses",
    authGuard,
    addressController.createAddresses
);

router.get(
    "/get-addresses",
    authGuard,
    addressController.getAddresses
);

export default router;