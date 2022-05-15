'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Condition extends Model {
    static associate(models) {
      Condition.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Condition.init({
    repeatAmount: DataTypes.INTEGER,
    tagAmount: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    orderSelected: DataTypes.STRING,
    mediaId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Condition',
    tableName: 'Conditions',
    underscored: true
  });
  return Condition;
};