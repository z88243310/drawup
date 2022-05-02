'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Award extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Award.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Award.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    mediaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Award',
    tableName: 'Awards',
    underscored: true
  });
  return Award;
};