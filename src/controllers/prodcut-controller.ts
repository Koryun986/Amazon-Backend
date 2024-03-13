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

    async testCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const mainImage = req.files["main-image"];
            if (!mainImage) {
                throw new Error("Please provide main image");
            }
            const images = req.files["images"];
            return res.json({
                body: req.body,
                main_image: mainImage[0],
                images
            })
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

    async buyProduct(req: Request, res: Response, next: NextFunction) {
        try {
            await productService.buyProduct(req.body.id, req.body.times);
            return res.json();
        } catch (e) {
            next(e);
        }
    }
}

export default new ProductController();