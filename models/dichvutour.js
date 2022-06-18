'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DichvuTour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DichvuTour.belongsTo(models.tour, {
        foreignKey: "tourId"
      })
    }
  };
  DichvuTour.init({
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tour",
        key: "id"
      }
    },
    dichvuId: {
      type: DataTypes.INTEGER,
      references: {
        model: "dichvu",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'dichvuTour',
  });
  return DichvuTour;
};