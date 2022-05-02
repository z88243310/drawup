'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conditions', 'user_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conditions', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER
    })
  }
};
