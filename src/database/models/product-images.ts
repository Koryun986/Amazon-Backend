import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default, BelongsTo } from "@sequelize/core/decorators-legacy";
import {Product} from "./product";

@Table({tableName: "product_images"})
export class ProductImage extends Model<InferAttributes<ProductImage>, InferCreationAttributes<ProductImage>> {
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