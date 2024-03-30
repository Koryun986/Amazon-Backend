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

@Table({tableName: "addresses"})
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

    @BelongsTo(() => User, "user_id")
    declare user?: NonAttribute<User>
}