import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull } from "@sequelize/core/decorators-legacy";

@Table({tableName: "Colors"})
export class Color extends Model<InferAttributes<Color>, InferCreationAttributes<Color>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

}