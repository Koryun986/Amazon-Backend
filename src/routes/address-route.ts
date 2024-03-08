import {Router} from "express";
import addressController from "./../controllers/address-controller";

const router = Router();

router.post("/create-addresses", addressController.createAddresses);

export default router;