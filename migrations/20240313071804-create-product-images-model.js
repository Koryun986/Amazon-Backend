'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Product_Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image_url: {
        type: Sequelize.STRING,
        notNull: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        notNull: true,
        references: {
          model: "Products",
          key: "id",
        }
      },
      is_main_image: {
        type: Sequelize.BOOLEAN,
        notNull: true,
        default: false,
      }
    });
    await queryInterface.addConstraint("Product_Images", {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'Products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Product_Images", "product_id");
    await queryInterface.dropTable("Product_Images");
  }
};
