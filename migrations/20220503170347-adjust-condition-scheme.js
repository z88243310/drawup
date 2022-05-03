'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Conditions', 'media_id',
      {
        type: Sequelize.STRING
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Conditions', 'media_id',
      {
        type: Sequelize.INTEGER
      }
    )
  }
}
