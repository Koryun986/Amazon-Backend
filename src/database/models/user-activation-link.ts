import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({tableName: "user-activation-links"})
export class UserActivationLink extends Model<InferAttributes<UserActivationLink>, InferCreationAttributes<UserActivationLink>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare activation_link: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: string;
}