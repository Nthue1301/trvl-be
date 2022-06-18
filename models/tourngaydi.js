'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourNgaydi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourNgaydi.belongsTo(models.tour, {
        foreignKey: "tourId"
      })
    }
  };
  TourNgaydi.init({
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tour",
        key: "id"
      }
    },
    ngaydiId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ngaydi",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'tourngaydi',
  });
  return TourNgaydi;
};