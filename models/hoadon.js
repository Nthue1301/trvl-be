'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hoadon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hoadon.belongsTo(models.user, {
        foreignKey: "userId"
      });
      Hoadon.belongsTo(models.tour, {
        foreignKey: "tourId"
      })
    }
  };
  Hoadon.init({
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tour",
        key: "id"
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id"
      }
    },
    nguoilon: DataTypes.INTEGER,
    treem: DataTypes.INTEGER,
    embe: DataTypes.INTEGER,
    ngaydi: DataTypes.STRING,
    thanhtien: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hoadon',
  });
  return Hoadon;
};