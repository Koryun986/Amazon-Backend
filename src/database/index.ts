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
import {Admin} from "./models/admin";
import {ProductImage} from "./models/product-images";
import {FavoriteProduct} from "./models/favorite-prodcut";
import {CartItem} from "./models/cart-item";
import {StripeCustomer} from "./models/stripe-customer";

const sequelize = new Sequelize(
  DATABASE_NAME!,
  DATABASE_USERNAME!,
  DATABASE_PASSWORD!,
  {
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  dialect: "postgres",
  define: {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  },
  models: [User, Token, UserActivationLink, Address, Product, Category, Color, Size, Admin, ProductImage, FavoriteProduct, CartItem, StripeCustomer]
});

export default sequelize;
