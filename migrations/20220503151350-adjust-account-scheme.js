'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Accounts', 'id',
      {
        type: Sequelize.STRING
      }
    )
    await queryInterface.removeColumn('Accounts', 'raw_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Accounts', 'id',
      {
        type: Sequelize.INTEGER
      }
    )
    await queryInterface.addColumn('Accounts', 'raw_id', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
}
