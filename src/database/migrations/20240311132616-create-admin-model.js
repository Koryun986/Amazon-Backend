'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
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
          model: "users",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    });
    await queryInterface.addConstraint("admins", {
      fields: ["user_id"],
      type: "foreign key",
      name: "user_id",
      references: {
        table: "users",
        field: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("admins", "user_id");
    await queryInterface.dropTable("admins");
  }
};
