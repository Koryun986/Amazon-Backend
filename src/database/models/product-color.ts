import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { Table, Attribute, NotNull } from "@sequelize/core/decorators-legacy";

@Table({tableName: "product-color"})
export class ProductColor extends Model<InferAttributes<ProductColor>, InferCreationAttributes<ProductColor>> {
  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare product_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare color_id: number;
}