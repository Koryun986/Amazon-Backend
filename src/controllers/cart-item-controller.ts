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

    async addCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const cartItem = await cartItemService.addCartItem(req.params.id, req.user);
            return res.json(cartItem);
        } catch (e) {
            next(e);
        }
    }

    async addCartItems(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const cartItems = await cartItemService.addCartItems(req.body, req.user);
            return res.json(cartItems);
        } catch (e) {
            next(e);
        }
    }

    async setCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const cartItem = await cartItemService.setCartItem(req.body, req.user);
            return res.json(cartItem);
        } catch (e) {
            next(e);
        }
    }
    async removeCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const id = await cartItemService.removeCartItem(+req.params.id, req.user);
            return res.json(id);
        } catch (e) {
            next(e);
        }
    }
}

export default new CartItemController();