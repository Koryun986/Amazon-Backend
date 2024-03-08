'use strict';
const {
  Model
} = require('sequelize');
const {User} = require("../src/database/models/user");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(Address);
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