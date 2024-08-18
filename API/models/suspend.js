"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Suspend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.Member, {
        foreignKey: "member_code",
        // as: 'member'
      });
    }
  }
  Suspend.init(
    {
      member_code: DataTypes.STRING,
      time_suspend: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Suspend",
    }
  );
  return Suspend;
};
