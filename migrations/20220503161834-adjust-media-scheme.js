'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Media', 'id',
      {
        type: Sequelize.STRING
      }
    )
    await queryInterface.removeColumn('Media', 'raw_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Media', 'id',
      {
        type: Sequelize.INTEGER
      }
    )
    await queryInterface.addColumn('Media', 'raw_id', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
}
