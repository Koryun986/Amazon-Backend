'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("new_product_size", {
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
      size_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Sizes",
          key: "id"
        }
      }
    });
    await queryInterface.addConstraint('new_product_size', {
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
    await queryInterface.addConstraint("new_product_size", {
      fields: ['size_id'],
      type: 'foreign key',
      name: 'size_id',
      references: {
        table: 'Sizes',
        field: 'id'
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("new_product_size", "product_id");
    await queryInterface.removeConstraint("new_product_size", "size_id");
    await queryInterface.dropTable("new_product_size");
  }
};
