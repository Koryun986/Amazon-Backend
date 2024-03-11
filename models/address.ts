'use strict';
import {CreationOptional, InferAttributes, InferCreationAttributes, Optional} from "sequelize";

const {
  Model
} = require('sequelize');
const {User} = require("../src/database/models/user");
const sequelize = require("../src/database");

interface AddressAttributes {
  id?: number;
  country: string;
  state: string;
  city: string;
  zip_code: string;
  street_address: string;
  is_default_address?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressesInput extends Optional<AddressAttributes, "id" | "createdAt" | "updatedAt"> {}

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    // id!: number;
    // country: string;
    // state: string;
    // city: string;
    // zip_code: string;
    // street_address: string;
    // is_default_address: boolean;
    //
    // createdAt!: Date;
    // updatedAt!:Date;

    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }

  Address.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country: {
      type: DataTypes.STRING,
      notNull: true,
    },
    state: {
      type: DataTypes.STRING,
      notNull: true,
    },
    city: {
      type: DataTypes.STRING,
      notNull: true,
    },
    zip_code: {
      type: DataTypes.STRING,
      notNull: true,
    },
    street_address: {
      type: DataTypes.STRING,
      notNull: true,
    },
    is_default_address: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};
//
// (async () => {
//   await sequelize.sync();
// })();