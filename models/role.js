'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.user, {
        through: "roles"
      })
    }
  };
  Role.init({
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    mota: DataTypes.STRING(1000)
  }, {
    sequelize,
    modelName: 'role',
  });
  return Role;
};