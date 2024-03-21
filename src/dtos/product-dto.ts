import {InferAttributes} from "@sequelize/core";
import {Product} from "../database/models/product";

export type ProductDto = Omit<InferAttributes<Product>, "id" | "color_id" | "category_id" | "size_id" | "total_earnings" | "time_bought" | "owner_id" | "images" | "size" | "color" | "category"> & {
    color: string;
    category: string;
    size: string;
    is_published?: boolean
};