'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "createdAt");
    await queryInterface.removeColumn("Users", "updatedAt");

    await queryInterface.removeColumn("user-activation-links", "createdAt");
    await queryInterface.removeColumn("user-activation-links", "updatedAt");

    await queryInterface.removeColumn("Addresses", "createdAt");
    await queryInterface.removeColumn("Addresses", "updatedAt");

    await queryInterface.removeColumn("Tokens", "createdAt");
    await queryInterface.removeColumn("Tokens", "updatedAt");
  },

  async down (queryInterface, Sequelize) {
    const timestamp = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    };
    await queryInterface.addColumn("Users", "createdAt", timestamp);
    await queryInterface.addColumn("Users", "updatedAt", timestamp);

    await queryInterface.addColumn("user-activation-links", "createdAt", timestamp);
    await queryInterface.addColumn("user-activation-links", "updatedAt", timestamp);

    await queryInterface.addColumn("Addresses", "createdAt", timestamp);
    await queryInterface.addColumn("Addresses", "updatedAt", timestamp);

    await queryInterface.addColumn("Tokens", "createdAt", timestamp);
    await queryInterface.addColumn("Tokens", "updatedAt", timestamp);
  }
};
