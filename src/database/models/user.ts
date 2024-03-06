import { Model, DataType, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "@sequelize/core";
//@ts-ignore
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from '@sequelize/core/decorators-legacy';

import { UserAttributes } from "../attributes/user-attributes";
export class User extends Model<UserAttributes> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: number;

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