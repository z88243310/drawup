'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      comment_id: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      media_id: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};