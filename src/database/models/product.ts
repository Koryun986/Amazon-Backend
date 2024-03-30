import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default, BelongsTo, BelongsToMany, HasMany, HasOne } from "@sequelize/core/decorators-legacy";
import {User} from "./user";
import {Size} from "./size";
import {ProductImage} from "./product-images";
import {Color} from "./color";
import {Category} from "./category";

@Table({tableName: "products", createdAt: false, updatedAt: false})
export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
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
        through: "product_color",
        foreignKey: "product_id",
        otherKey: "color_id",
    })
    declare colors?: NonAttribute<Color[]>;

    declare setColors: BelongsToManySetAssociationsMixin<Color, Color["id"]>;

    declare addColor: BelongsToManyAddAssociationMixin<Color, Color["id"]>;

    declare removeColor: BelongsToManyRemoveAssociationMixin<Color, Color["id"]>;

    @BelongsToMany(() => Size, {
        through: "product_size",
        foreignKey: "product_id",
        otherKey: "size_id",
    })
    declare sizes?: NonAttribute<Size[]>;

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

    @HasMany(() => ProductImage, {
        foreignKey: {
            name: "product_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        scope: {
            is_main_image: false,
        },
    })
    declare images?: NonAttribute<ProductImage[]>;

    @HasOne(() => ProductImage, {
        foreignKey: {
            name: "product_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        scope: {
            is_main_image: true,
        }
    })
    declare main_image?: NonAttribute<ProductImage>;

    @BelongsTo(() => User, "owner_id")
    declare owner?: NonAttribute<User>
}