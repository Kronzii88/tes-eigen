'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Member, {
        foreignKey: 'member_code',
        as: 'member'
      })

      this.belongsTo(models.Book, {
        foreignKey: 'book_code',
        as: 'book'
      })


    }
  }
  Borrow.init({
    member_code: DataTypes.STRING,
    book_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Borrow',
  });
  return Borrow;
};