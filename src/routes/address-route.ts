import {Router} from "express";
import addressController from "./../controllers/address-controller";
import {authGuard} from "../middlewares/auth-middleware";

const router = Router();

router.use(authGuard)

router.post(
    "/create",
    addressController.createAddress
);
router.put(
    "/update",
    addressController.updateAddress
)
router.get(
    "/get-addresses",
    addressController.getAddresses
);
router.delete(
    "/delete/:id",
    addressController.deleteAddress
)

export default router;