'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("new_product_color", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "new_products",
          key: "id"
        }
      },
      color_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Colors",
          key: "id"
        }
      }
    });
    await queryInterface.addConstraint('new_product_color', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'new_products',
        field: 'id'
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
    await queryInterface.addConstraint("new_product_color", {
      fields: ['color_id'],
      type: 'foreign key',
      name: 'color_id',
      references: {
        table: 'Colors',
        field: 'id'
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("new_product_color", "product_id");
    await queryInterface.removeConstraint("new_product_color", "color_id");
    await queryInterface.dropTable("new_product_color");
  }
};
