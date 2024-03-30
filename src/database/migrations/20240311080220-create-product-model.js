'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      brand: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      time_bought: {
        type: Sequelize.FLOAT,
        default: 0,
      },
      total_earnings: {
        type: Sequelize.FLOAT,
        default: 0,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    });
    await queryInterface.addConstraint('products', {
      fields: ['owner_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("products", {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'category_id',
      references: {
        table: 'categories',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  }
};
