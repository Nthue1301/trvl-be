'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ngaydi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ngaydi.belongsToMany(models.tour, {
        through: "tourngaydis"
      })
    }
  };
  Ngaydi.init({
    ngay: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ngaydi',
  });
  return Ngaydi;
};