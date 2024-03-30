import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, HasMany } from "@sequelize/core/decorators-legacy";
import {Product} from "./product";
import {NonAttribute} from "sequelize";

@Table({tableName: "categories"})
export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.INTEGER)
    declare parent_id: CreationOptional<number>;

    @HasMany(() => Product, {
        foreignKey: "category_id",
        inverse: {
            as: "category",
        },
    })
    declare products?: NonAttribute<Product[]>;
}