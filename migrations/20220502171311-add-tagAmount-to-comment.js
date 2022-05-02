'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments', 'tag_amount', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comments', 'tag_amount')
  }
};
