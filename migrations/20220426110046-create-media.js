'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      caption: {
        type: Sequelize.TEXT('long')
      },
      raw_id: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      media_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image_url: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      permalink: {
        allowNull: false,
        type: Sequelize.STRING
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      like_count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comments_count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Media');
  }
};