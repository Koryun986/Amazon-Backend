'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("product_color", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          key: "id"
        }
      },
      color_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "colors",
          key: "id"
        }
      }
    });
    await queryInterface.addConstraint('product_color', {
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
    await queryInterface.addConstraint("product_color", {
      fields: ['color_id'],
      type: 'foreign key',
      name: 'color_id',
      references: {
        table: 'colors',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("product_color", "product_id");
    await queryInterface.removeConstraint("product_color", "color_id");
    await queryInterface.dropTable("product_color");
  }
};
