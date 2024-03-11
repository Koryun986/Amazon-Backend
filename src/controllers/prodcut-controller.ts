import { Request, Response, NextFunction } from "express";
import productService from "../services/product-service";

class ProdcutController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productService.getProducts();
            return res.json(products);
        } catch (e) {
            next(e);
        }
    }
}

export default new ProdcutController();