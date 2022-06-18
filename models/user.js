'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: "userRoles"
      }),
        User.belongsToMany(models.Tour, {
          through: "hoadons"
        }),
        User.belongsToMany(models.Tour, {
          through: "binhluans"
        }),
        User.hasMany(models.UserRole),
        User.hasMany(models.Hoadoncanhan),
        User.hasMany(models.Thongbao)
    }
  };
  User.init({
    name: DataTypes.STRING,
    gioitinh: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING(1000),
    tenanh: DataTypes.STRING(500),
    diachi: DataTypes.STRING,
    sdt: DataTypes.STRING,
    ngaysinh: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};