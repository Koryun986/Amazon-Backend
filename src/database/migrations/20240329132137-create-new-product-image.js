'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("new_product_images", {
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
          model: "new_products",
          key: "id",
        }
      },
      is_main_image: {
        type: Sequelize.BOOLEAN,
        notNull: true,
        default: false,
      }
    });
    await queryInterface.addConstraint("new_product_images", {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'new_products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("new_product_images", "product_id");
    await queryInterface.dropTable("new_product_images");
  }
};
