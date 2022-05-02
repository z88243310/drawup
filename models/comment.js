'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Comment.init({
    text: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    username: DataTypes.STRING,
    rawId: DataTypes.TEXT,
    mediaId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  });
  return Comment;
};