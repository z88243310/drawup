'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'access_token', {
      type: Sequelize.TEXT('long')
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'access_token', {
      type: Sequelize.STRING
    })
  }
};
