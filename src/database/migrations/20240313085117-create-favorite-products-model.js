'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("favorite_products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        notNull: true,
        references: {
          model: "products",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        notNull: true,
        references: {
          model: "users",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    });
    await queryInterface.addConstraint("favorite_products", {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("favorite_products", {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("favorite_products", "product_id");
    await queryInterface.removeConstraint("favorite_products", "user_id");
    await queryInterface.dropTable("favorite_products");
  }
};
