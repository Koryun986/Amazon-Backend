'use strict';

const {Op} = require("@sequelize/core");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Clothes"
      },
      {
        name: "Jackets",
        parent_id: 1
      },
      {
        name: "Jeans",
        parent_id: 1,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {[Op.or]: [{name: 'Clothes'}, {name: 'Jackets'}, {name: "Jeans"}]});
  }
};
