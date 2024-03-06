import { Sequelize } from "@sequelize/core";
import { DATABASE_NAME, DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '../config/envirenmentVariables';
import { User } from "./models/user";

const sequelize = new Sequelize(
  DATABASE_NAME!,
  DATABASE_USERNAME!,
  DATABASE_PASSWORD!,
  {
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  dialect: "postgres",
  models: [User]
});

export default sequelize;