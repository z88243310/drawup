'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Media', 'user_id')
    await queryInterface.addColumn('Media', 'account_id',
      {
        allowNull: false,
        type: Sequelize.STRING
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Media', 'user_id',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    )
    await queryInterface.removeColumn('Media', 'account_id')
  }
};
