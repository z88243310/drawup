'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comments', 'user_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER
    })
  }
};
