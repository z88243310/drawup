'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conditions', 'keyword',
      {
        type: Sequelize.STRING
      },
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conditions', 'keyword')
  }
};
