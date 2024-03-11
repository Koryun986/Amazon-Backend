import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from "@sequelize/core/decorators-legacy";

@Table({tableName: "Products"})
export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare brand: string;

    @Attribute(DataTypes.FLOAT)
    @NotNull
    declare price: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare category_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare color_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare size_id: number;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    @Default(false)
    declare is_published: CreationOptional<boolean>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare time_bought: number;

    @Attribute(DataTypes.FLOAT)
    @NotNull
    @Default(0)
    declare total_earnings: number;
}