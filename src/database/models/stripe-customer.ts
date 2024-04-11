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

@Table({tableName: "stripe_customer"})
export class StripeCustomer extends Model<InferAttributes<StripeCustomer>, InferCreationAttributes<StripeCustomer>> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare stripe_customer_id: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @BelongsTo(() => User, "user_id")
  declare user?: NonAttribute<User>
}
