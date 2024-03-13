import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull } from "@sequelize/core/decorators-legacy";
import {Default} from "@sequelize/core/types/decorators/legacy";

@Table({tableName: "Product_Images"})
export class ProductImages extends Model<InferAttributes<ProductImages>, InferCreationAttributes<ProductImages>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare image_url: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare product_id: number;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    @Default(false)
    declare is_main_image: boolean;
}