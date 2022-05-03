'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Comment.init({
    text: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    username: DataTypes.STRING,
    tagAmount: DataTypes.INTEGER,
    mediaId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  });
  return Comment;
};