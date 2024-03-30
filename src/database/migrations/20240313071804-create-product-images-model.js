'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("product_images", {
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
          model: "products",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
      },
      is_main_image: {
        type: Sequelize.BOOLEAN,
        notNull: true,
        default: false,
      }
    });
    await queryInterface.addConstraint("product_images", {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'product_id',
      references: {
        table: 'products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("product_images", "product_id");
    await queryInterface.dropTable("product_images");
  }
};
