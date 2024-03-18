import { Request, Response, NextFunction } from "express";
import addressService from "./../services/address-service";

class AddressController {
    async createAddress(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const addresses = await addressService.createAddress(req.body, req.user);
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
            const address = await addressService.updateAddress(req.body);
            return res.json(address);
        } catch (e) {
            next(e);
        }
    }

    async deleteAddress(req: Request, res: Response, next: NextFunction) {
        try {
            await addressService.deleteAddress(req.body.id);

            return res.json();
        } catch (e) {
            next(e);
        }
    }
}

export default new AddressController();