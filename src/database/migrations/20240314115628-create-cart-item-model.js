'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("cart_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      count: {
        type: Sequelize.INTEGER,
        notNull: true,
        default: 1,
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
    await queryInterface.addConstraint("cart_items", {
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
    await queryInterface.addConstraint("cart_items", {
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
    await queryInterface.removeConstraint("cart_items", "product_id");
    await queryInterface.removeConstraint("cart_items", "user_id");
    await queryInterface.dropTable("cart_items");
  }
};
