'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'last_media_id',
      {
        type: Sequelize.STRING
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'last_media_id')
  }
};
