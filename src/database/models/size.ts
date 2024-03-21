import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, HasMany } from "@sequelize/core/decorators-legacy";
import {Product} from "./product";
import {NonAttribute} from "sequelize";

@Table({tableName: "Sizes"})
export class Size extends Model<InferAttributes<Size>, InferCreationAttributes<Size>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @HasMany(() => Product, {
        foreignKey: "size_id",
        inverse: {
            as: "size",
        },
    })
    declare products?: NonAttribute<Product[]>;
}