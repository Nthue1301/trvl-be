'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourLoaitour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourLoaitour.belongsTo(models.tour, {
        foreignKey: "tourId"
      })
    }
  };
  TourLoaitour.init({
    loaitourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "loaitour",
        key: "id"
      }
    },
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tour",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'tourloaitour',
  });
  return TourLoaitour;
};