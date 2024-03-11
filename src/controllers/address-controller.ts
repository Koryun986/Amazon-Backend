import { Request, Response, NextFunction } from "express";
import addressService from "./../services/address-service";

class AddressController {
    async createAddresses(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const addresses = await addressService.createAddresses(req.body, req.user);
            return res.json(addresses);
        } catch (e) {
            next(e);
        }
    }

    async getAddresses(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const addresses = await addressService.getAddresses(req.user);
            return res.json(addresses);
        } catch (e) {
            next(e);
        }
    }

    async updateAddress(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const address = await addressService.updateAddress(req.body, req.user);
            return res.json(address);
        } catch (e) {
            next(e);
        }
    }
}

export default new AddressController();