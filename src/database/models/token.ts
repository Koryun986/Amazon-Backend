import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare refresh_token: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare expires_in: Date;

    @Attribute(DataTypes.INTEGER)
    declare user_id: number;
}