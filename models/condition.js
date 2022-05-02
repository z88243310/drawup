'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Condition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Condition.belongsTo(models.Media, { foreignKey: 'mediaId' })
    }
  }
  Condition.init({
    repeatAmount: DataTypes.INTEGER,
    tagAmount: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    mediaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Condition',
    tableName: 'Conditions',
    underscored: true
  });
  return Condition;
};