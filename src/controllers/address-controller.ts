import { Request, Response, NextFunction } from "express";
import addressService from "./../services/address-service";
import {getAccessTokenFromBearer} from "../utils/auth-helpers";

class AddressController {
    async createAddresses(req: Request, res: Response, next: NextFunction) {
        try {
            const addresses = await addressService.createAddresses(req.body, req.user);
            return res.json(addresses);
        } catch (e) {
            next(e);
        }
    }

    async getAddresses(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {
            next(e);
        }
    }

}

export default new AddressController();