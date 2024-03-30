import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "@sequelize/core";
import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo, Table } from "@sequelize/core/decorators-legacy";
import {User} from "./user";

@Table({tableName: "tokens"})
export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare refresh_token: string;

    @Attribute(DataTypes.INTEGER)
    declare user_id: number;

    @BelongsTo(() => User, "user_id")
    declare user?: NonAttribute<User>
}