import { Request, Response, NextFunction } from "express";
import categoryService from "./../services/category-service";

class CategoryController {
    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.getCategories();
            return res.json(categories);
        } catch (e) {
            next(e);
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await categoryService.createCategory(req.body);
            return res.json(category);
        } catch (e) {
            next(e);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await categoryService.updateCategory(req.body);
            return res.json(category);
        } catch (e) {
            next(e);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            await categoryService.deleteCategory(+req.params.id);
            return res.json();
        } catch (e) {
            next(e);
        }
    }
}

export default new CategoryController();