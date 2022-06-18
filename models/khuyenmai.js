'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Khuyenmai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Khuyenmai.belongsToMany(models.tour, {
        through: "tourkhuyenmais"
      })
    }
  };
  Khuyenmai.init({
    name: DataTypes.STRING,
    khuyenmai: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'khuyenmai',
  });
  return Khuyenmai;
};