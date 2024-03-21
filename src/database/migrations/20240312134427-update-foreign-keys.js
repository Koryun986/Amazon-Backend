'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const foreignKeyOptions = {

      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    };
    await queryInterface.changeColumn("Tokens", "user_id", foreignKeyOptions);
    await queryInterface.changeColumn("user-activation-links", "user_id", foreignKeyOptions);
    await queryInterface.changeColumn("Addresses", "user_id", foreignKeyOptions);
    await queryInterface.changeColumn("Admins", "user_id", foreignKeyOptions);
    await queryInterface.changeColumn("Products", "owner_id", foreignKeyOptions);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
