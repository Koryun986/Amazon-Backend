import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from "@sequelize/core";
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from "@sequelize/core/decorators-legacy";
import {User} from "./user";

@Table({tableName: "admins"})
export class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: number;

    @BelongsTo(() => User, "user_id")
    declare user?: NonAttribute<User>
}