'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.User, { foreignKey: 'userId' })
      Media.hasMany(models.Comment, { foreignKey: 'mediaId' })
      Media.hasOne(models.Condition, { foreignKey: 'mediaId' })
      Media.hasMany(models.Award, { foreignKey: 'mediaId' })
    }
  }
  Media.init({
    caption: DataTypes.STRING,
    rawId: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    permalink: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    likeCount: DataTypes.INTEGER,
    commentsCount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Media',
    tableName: 'Media',
    underscored: true,
    timestamps: false
  });
  return Media;
};