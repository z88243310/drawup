'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conditions', 'orderSelected',
      {
        allowNull: false,
        type: Sequelize.STRING
      },
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conditions', 'orderSelected')
  }
};
