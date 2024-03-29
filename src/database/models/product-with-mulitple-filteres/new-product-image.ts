import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from "@sequelize/core/decorators-legacy";

@Table({tableName: "new_product_images"})
export class NewProductImage extends Model<InferAttributes<NewProductImage>, InferCreationAttributes<NewProductImage>> {
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