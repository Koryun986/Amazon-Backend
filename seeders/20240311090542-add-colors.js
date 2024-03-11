'use strict';

const {Op} = require("@sequelize/core");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Colors", [
      {
        name: "White"
      },
      {
        name: "Black",
      },
      {
        name: "Blue",
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Colors", {[Op.or]: [{name: "White"}, {name: "Black"},{name: "Blue"}]});
  }
};
