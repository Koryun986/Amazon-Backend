import {Model, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes} from "@sequelize/core";
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default, Table } from "@sequelize/core/decorators-legacy";

@Table({tableName: "users"})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare first_name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare last_name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;
    
    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    @Default(false)
    declare is_activated: CreationOptional<boolean>;
}