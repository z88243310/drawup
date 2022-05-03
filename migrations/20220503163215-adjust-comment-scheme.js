'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Comments', 'id',
      {
        type: Sequelize.STRING
      }
    )
    await queryInterface.removeColumn('Comments', 'raw_id')
    await queryInterface.changeColumn('Comments', 'media_id',
      {
        type: Sequelize.STRING
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Comments', 'id',
      {
        type: Sequelize.INTEGER
      }
    )
    await queryInterface.addColumn('Comments', 'raw_id', {
      allowNull: false,
      type: Sequelize.STRING
    })
    await queryInterface.changeColumn('Comments', 'media_id',
      {
        type: Sequelize.INTEGER
      }
    )
  }
}
