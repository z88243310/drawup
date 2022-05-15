'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conditions', 'order_selected',
      {
        allowNull: false,
        type: Sequelize.STRING
      },
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conditions', 'order_selected')
  }
};
