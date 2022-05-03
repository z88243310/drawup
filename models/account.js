'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Account.init({
    name: DataTypes.STRING,
    rawId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'Accounts',
    underscored: true,
    timestamps: false
  });
  return Account;
};