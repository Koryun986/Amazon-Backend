import { Request, Response, NextFunction } from "express";
import productService from "../services/product-service";

class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productService.getProducts();
            return res.json(products);
        } catch (e) {
            next(e);
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const product = await productService.createProduct(req.body, req.user);
            return res.json(product);
        } catch (e) {
            next(e);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const product = await productService.updateProduct(req.body, req.user);
            return res.json(product);
        } catch (e) {
            next(e);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            await productService.deleteProduct(req.body.id, req.user);
            return res.json();
        } catch (e) {
            next(e);
        }
    }
}

export default new ProductController();