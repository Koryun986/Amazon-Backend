import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    NonAttribute
} from '@sequelize/core';
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table, BelongsTo } from "@sequelize/core/decorators-legacy";
import {User} from "./user";

@Table({tableName: "user-activation-links"})
export class UserActivationLink extends Model<InferAttributes<UserActivationLink>, InferCreationAttributes<UserActivationLink>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare activation_link: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: number;

    @BelongsTo(() => User, "user_id")
    declare user?: NonAttribute<User>
}