'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Admins", {
      id: {
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        notNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        }
      }
    });
    await queryInterface.addConstraint("Admins", {
      fields: ["user_id"],
      type: "foreign key",
      name: "user_id",
      references: {
        table: "Users",
        field: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Admins", "user_id");
    await queryInterface.dropTable("Admins");
  }
};
