import {Model, DataTypes, InferAttributes, InferCreationAttributes} from "@sequelize/core";
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default, CreationOptional } from "@sequelize/core/decorators-legacy";

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare country: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare state: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare city: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare zip_code: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare street_address: string;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    @Default(false)
    declare is_default_address: CreationOptional<boolean>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: number;
}