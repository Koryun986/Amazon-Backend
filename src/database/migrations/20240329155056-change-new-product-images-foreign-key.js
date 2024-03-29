'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("new_product_images", "product_id", {
      type: Sequelize.INTEGER,
      notNull: true,
      references: {
        model: "new_products",
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("new_product_images", "product_id", {
      type: Sequelize.INTEGER,
      notNull: true,
      references: {
        model: "new_products",
        key: "id",
      },
    })
  }
};
