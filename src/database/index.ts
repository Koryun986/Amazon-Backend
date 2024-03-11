import { Sequelize } from "@sequelize/core";
import { DATABASE_NAME, DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '../config/envirenmentVariables';
import { User } from "./models/user";
import { Token } from "./models/token";
import { UserActivationLink } from "./models/user-activation-link";
import { Address  } from "./models/address";
import { Product } from "./models/product";
import { Category } from "./models/category";
import { Color } from "./models/color";
import { Size } from "./models/size";

const sequelize = new Sequelize(
  DATABASE_NAME!,
  DATABASE_USERNAME!,
  DATABASE_PASSWORD!,
  {
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  dialect: "postgres",
  define: {
    timestamps: false
  },
  models: [User, Token, UserActivationLink, Address, Product, Category, Color, Size]
});

export default sequelize;