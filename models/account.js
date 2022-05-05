'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsTo(models.User, { foreignKey: 'userId' })
      Account.hasMany(models.Media, { foreignKey: 'accountId' })
    }
  }
  Account.init({
    name: DataTypes.STRING,
    userId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'Accounts',
    underscored: true,
  });
  return Account;
};