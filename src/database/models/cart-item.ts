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

@Table({tableName: "cart_items", createdAt: false, updatedAt: false})
export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    @Default(1)
    declare count: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    user_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    product_id: number;

    @BelongsTo(() => User, "user_id")
    declare user?: NonAttribute<User>
}