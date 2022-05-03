'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Award extends Model {
    static associate(models) {
      Award.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Award.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    mediaId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Award',
    tableName: 'Awards',
    underscored: true
  });
  return Award;
};