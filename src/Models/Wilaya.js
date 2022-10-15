const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const wilaya = sequelize.define(
  "wilaya",
  {
    idWilaya: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomWilaya: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = wilaya;
