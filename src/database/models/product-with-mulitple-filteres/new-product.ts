import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default, BelongsTo, BelongsToMany, HasMany } from "@sequelize/core/decorators-legacy";
import {User} from "../user";
import {Size} from "../size";
import {ProductImage} from "../product-images";
import {Color} from "../color";
import {Category} from "../category";
import {NewProductImage} from "./new-product-image";

@Table({tableName: "new_products", createdAt: false, updatedAt: false})
export class NewProduct extends Model<InferAttributes<NewProduct>, InferCreationAttributes<NewProduct>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.TEXT)
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

  @BelongsTo(() => Category, {
    foreignKey: "category_id",
  })
  declare category?: NonAttribute<Category>;

  @BelongsToMany(() => Color, {
    through: "new_product_color"
  })
  declare colors?: NonAttribute<Color>;

  declare setColors: BelongsToManySetAssociationsMixin<Color, Color["id"]>;

  declare addColor: BelongsToManyAddAssociationMixin<Color, Color["id"]>;

  declare removeColor: BelongsToManyRemoveAssociationMixin<Color, Color["id"]>;

  @BelongsToMany(() => Size, {
    through: "new_product_size"
  })
  declare sizes?: NonAttribute<Size>;

  declare setSizes: BelongsToManySetAssociationsMixin<Size, Size["id"]>;

  declare addSize: BelongsToManyAddAssociationMixin<Size, Size["id"]>;

  declare removeSize: BelongsToManyRemoveAssociationMixin<Size, Size["id"]>;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare is_published: CreationOptional<boolean>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Default(0)
  declare time_bought: number;

  @Attribute(DataTypes.FLOAT)
  @NotNull
  @Default(0)
  declare total_earnings: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare owner_id: number;

  @HasMany(() => NewProductImage, {
    foreignKey: {
      name: "product_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    scope: {
      is_main_image: false,
    }
  })
  declare images?: NonAttribute<NewProductImage[]>;

  @HasMany(() => NewProductImage, {
    foreignKey: "product_id",
    scope: {
      is_main_image: true,
    }
  })
  declare main_image?: NonAttribute<ProductImage>;

  @BelongsTo(() => User, "owner_id")
  declare owner?: NonAttribute<User>
}