import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from "@sequelize/core/types/decorators/legacy";

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
}