import { Request, Response, NextFunction } from "express";
import addressService from "./../services/address-service";
import {getAccessTokenFromBearer} from "../utils/auth-helpers";

class AddressController {
    async createAddresses(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) {
                throw new Error("UnAuthorized Error");
            }
            const accessToken = getAccessTokenFromBearer(req.headers.authorization);
            const addresses = await addressService.createAddresses(req.body, accessToken);
            return res.json(addresses);
        } catch (e) {
            next(e);
        }
    }
}

export default new AddressController();