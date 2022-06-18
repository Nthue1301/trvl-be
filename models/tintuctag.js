'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TintucTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TintucTag.belongsTo(models.tag, {
        foreignKey: "tagId"
      });
      TintucTag.belongsTo(models.tintuc, {
        foreignKey: "tintucId"
      });
    }
  };
  TintucTag.init({
    tintucId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tintuc",
        key: "id"
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tag",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'tintucTag',
  });
  return TintucTag;
};