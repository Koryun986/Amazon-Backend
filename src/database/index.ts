import { Sequelize } from 'sequelize-typescript';
import { DATABASE_NAME, DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '../config/envirenmentVariables';

const sequelize = new Sequelize({
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  dialect: "postgres",
//   models: [__dirname + '/models'],
});

export default sequelize;