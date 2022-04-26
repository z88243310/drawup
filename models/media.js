'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Media.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Media.init({
    caption: DataTypes.STRING,
    mediaId: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    permalink: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    likeCount: DataTypes.INTEGER,
    commentsCount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Media',
    tableName: 'Media',
    underscored: true
  });
  return Media;
};