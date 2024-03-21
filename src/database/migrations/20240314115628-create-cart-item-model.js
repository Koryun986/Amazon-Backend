'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Cart_Items", {
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
          model: "Products",
          key: "id",
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        notNull: true,
        references: {
          model: "Users",
          key: "id",
        }
      }
    });
    await queryInterface.addConstraint("Cart_Items", {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'Products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("Cart_Items", {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Cart_Items", "product_id");
    await queryInterface.removeConstraint("Cart_Items", "user_id");
    await queryInterface.dropTable("Cart_Items");
  }
};
