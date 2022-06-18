'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourDiadiem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourDiadiem.belongsTo(models.Tour, {
        foreignKey: "tourId"
      })
    }
  };
  TourDiadiem.init({
    diadiemId: {
      type: DataTypes.INTEGER,
      references: {
        model: "diadiem",
        key: "id"
      }
    },
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tour",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'tourDiadiem',
  });
  return TourDiadiem;
};