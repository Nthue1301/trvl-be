'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Tour.belongsToMany(models.User, {
        through: "binhluans"
      }),
        Tour.belongsToMany(models.Dichvu, {
          through: "dichvutours"
        }),
        Tour.belongsToMany(models.User, {
          through: "hoadons"
        }),
        Tour.belongsToMany(models.Ngaydi, {
          through: "tourngaydis"
        }),
        Tour.hasMany(models.Anh),
        Tour.belongsToMany(models.Loaitour, {
          through: "tourloaitours"
        }),
        Tour.belongsToMany(models.Diadiem, {
          through: "tourdiadiems"
        }),
        Tour.belongsToMany(models.Khuyenmai, {
          through: "tourkhuyenmais"
        })
      Tour.hasMany(models.TourKhuyenmai),
        Tour.hasMany(models.TourDiadiem),
        Tour.hasMany(models.TourLoaitour),
        Tour.hasMany(models.DichvuTour),
        Tour.hasMany(models.TourNgaydi)
    }
  };
  Tour.init({
    name: DataTypes.STRING(500),
    avatar: DataTypes.STRING(5000),
    tenanh: DataTypes.STRING(1000),
    gianguoilon: DataTypes.INTEGER,
    giatreem: DataTypes.INTEGER,
    giaembe: DataTypes.INTEGER,
    trailer: DataTypes.STRING(1000),
    chitiettour: DataTypes.TEXT,
    luuy: DataTypes.TEXT,
    vitri: DataTypes.INTEGER,
    bando: DataTypes.STRING(5000),
    status: DataTypes.INTEGER,
    songuoi: DataTypes.INTEGER,
    thoigian: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tour',
  });
  return Tour;
};