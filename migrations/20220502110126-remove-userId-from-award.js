'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Awards', 'user_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Awards', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER
    })
  }
};
