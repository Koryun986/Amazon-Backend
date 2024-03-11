'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
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
          model: "Categories",
          key: "id",
        },
      },
      color_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Colors",
          key: "id",
        },
      },
      size_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Sizes",
          key: "id",
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
          model: "Users",
          key: "id"
        }
      }
    });
    await queryInterface.addConstraint('Products ', {
      fields: ['owner_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("Products", {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'category_id',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("Products", {
      fields: ['size_id'],
      type: 'foreign key',
      name: 'size_id',
      references: {
        table: 'Sizes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint("Products", {
      fields: ['color_id'],
      type: 'foreign key',
      name: 'color_id',
      references: {
        table: 'Colors',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Products", "owner_id");
    await queryInterface.removeConstraint("Products", "category_id");
    await queryInterface.removeConstraint("Products", "size_id");
    await queryInterface.removeConstraint("Products", "color_id");
    await queryInterface.dropTable("Products");
  }
};
