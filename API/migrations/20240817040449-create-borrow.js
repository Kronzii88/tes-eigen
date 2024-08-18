"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Borrows", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      member_code: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Members",
          },
          key: "code",
        },
      },
      book_code: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Books",
          },
          key: "code",
        },
      },
      time_borrow: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time_return: {
        type: Sequelize.DATEONLY,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Borrows");
  },
};
