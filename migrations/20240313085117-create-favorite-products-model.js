'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Favorite_Products", {
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
    await queryInterface.addConstraint("Favorite_Products", {
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
    await queryInterface.addConstraint("Favorite_Products", {
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
    await queryInterface.removeConstraint("Favorite_Products", "product_id");
    await queryInterface.removeConstraint("Favorite_Products", "user_id");
    await queryInterface.dropTable("Favorite_Products");
  }
};
