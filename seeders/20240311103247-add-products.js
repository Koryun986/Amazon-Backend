'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        name: 'Sample Product 1',
        description: 'Sample Description 1',
        brand: 'Sample Brand 1',
        price: 10.99,
        category_id: 1,
        color_id: 1,
        size_id: 1,
        is_published: true,
        owner_id: 1
      },
      {
        name: 'Sample Product 2',
        description: 'Sample Description 2',
        brand: 'Sample Brand 2',
        price: 19.99,
        category_id: 1,
        color_id: 1,
        size_id: 1,
        is_published: false,
        owner_id: 1
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
