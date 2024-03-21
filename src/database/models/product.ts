import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default, BelongsTo } from "@sequelize/core/decorators-legacy";
import {User} from "./user";
import {Color} from "./color";
import {Size} from "./size";
import {Category} from "./category";
import {ProductImage} from "./product-images";

@Table({tableName: "Products", createdAt: false, updatedAt: false})
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

    /** Defined by {@link Category.products} */
    declare category?: NonAttribute<Category>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare category_id: number;

    /** Defined by {@link Color.products} */
    declare color?: NonAttribute<Color>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare color_id: number;

    /** Defined by {@link Size.products} */
    declare size?: NonAttribute<Size>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare size_id: number;

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

    /** Declared by {@link ProductImage#product} */
    declare images?: ProductImage[];

    @BelongsTo(() => User, "owner_id")
    declare user?: NonAttribute<User>
}