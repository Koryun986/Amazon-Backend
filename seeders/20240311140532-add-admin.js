'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Admins", [{
      user_id: 1,
    }], {});
  },

  async down (queryInterface, Sequelize) {
  }
};
