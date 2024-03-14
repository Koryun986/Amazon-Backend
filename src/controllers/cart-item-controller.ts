import {NextFunction, Request, Response} from "express";
import cartItemService from "../services/cart-item-service";

class CartItemController {
    async getCartItems(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const cartItems = await cartItemService.getCartItems(req.user);
            return res.json(cartItems);
        } catch (e) {
            next(e);
        }
    }
}

export default new CartItemController();