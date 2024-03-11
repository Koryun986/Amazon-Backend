import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from "@sequelize/core/decorators-legacy";

@Table({tableName: "Categories"})
export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.INTEGER)
    declare parent_id: CreationOptional<number>;
}