import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from "@sequelize/core/decorators-legacy";

@Table({tableName: "Favorite_Products", createdAt: false, updatedAt: false})
export class FavoriteProduct extends Model<InferAttributes<FavoriteProduct>, InferCreationAttributes<FavoriteProduct>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    user_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    product_id: number;
}