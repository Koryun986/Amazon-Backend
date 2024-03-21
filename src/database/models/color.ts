import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, HasMany } from "@sequelize/core/decorators-legacy";
import {Product} from "./product";
import {NonAttribute} from "sequelize";

@Table({tableName: "Colors"})
export class Color extends Model<InferAttributes<Color>, InferCreationAttributes<Color>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @HasMany(() => Product, {
        foreignKey: "color_id",
        inverse: {
            as: "color",
        },
    })
    declare products?: NonAttribute<Product[]>;
}