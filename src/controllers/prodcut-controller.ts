import { Request, Response, NextFunction } from "express";
import productService from "../services/product-service";

class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.query;
            let products;
            if (!params) {
                products = await productService.getProducts();
            } else {
                products = await productService.getProductsByParams(params);
            }
            return res.json(products);
        } catch (e) {
            next(e);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.getProductById(req.params.id);
        } catch (e) {
            next(e);
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const mainImage = req.files["main-image"][0];
            if (!mainImage) {
                throw new Error("Please provide main image");
            }
            const images = req.files["images"];
            const requestData = {
                productDto: {
                    ...req.body,
                    is_published: req.body.is_published === "true" ? true : false,
                    price: +req.body.price,
                },
                mainImage,
                images,
            };
            //@ts-ignore
            const product = await productService.createProduct(requestData, req.user);
            return res.json(product);
        } catch (e) {
            next(e);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const mainImage = req.files["main-image"][0];
            if (!mainImage) {
                throw new Error("Please provide main image");
            }
            const images = req.files["images"];
            const requestData = {
                productDto: req.body,
                mainImage,
                images,
            };
            //@ts-ignore
            const product = await productService.updateProduct(requestData, req.user);
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