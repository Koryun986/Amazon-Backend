import {Router} from "express";
import addressController from "./../controllers/address-controller";
import {authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.post(
    "/create",
    authGuard,
    addressController.createAddress
);
router.put(
    "/update",
    authGuard,
    addressController.updateAddress
)
router.get(
    "/get-addresses",
    authGuard,
    addressController.getAddresses
);
router.delete(
    "/delete",
    authGuard,
    addressController.deleteAddress
)

export default router;