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

      Tour.belongsToMany(models.user, {
        through: "binhluans"
      }),
        Tour.belongsToMany(models.dichvu, {
          through: "dichvutours"
        }),
        Tour.belongsToMany(models.user, {
          through: "hoadons"
        }),
        Tour.belongsToMany(models.ngaydi, {
          through: "tourngaydis"
        }),
        Tour.hasMany(models.anh),
        Tour.belongsToMany(models.loaitour, {
          through: "tourloaitours"
        }),
        Tour.belongsToMany(models.diadiem, {
          through: "tourdiadiems"
        }),
        Tour.belongsToMany(models.khuyenmai, {
          through: "tourkhuyenmais"
        })
      Tour.hasMany(models.tourkhuyenmai),
        Tour.hasMany(models.tourdiadiem),
        Tour.hasMany(models.tourloaitour),
        Tour.hasMany(models.dichvutour),
        Tour.hasMany(models.tourngaydi)
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