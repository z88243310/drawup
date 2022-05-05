'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'id',
      {
        autoIncrement: false,
        type: Sequelize.STRING
      }
    )
    await queryInterface.changeColumn('Accounts', 'user_id',
      {
        type: Sequelize.STRING
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'id',
      {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      }
    )
    await queryInterface.changeColumn('Accounts', 'user_id',
      {
        type: Sequelize.INTEGER
      }
    )
  }
};
