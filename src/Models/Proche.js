const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const proche = sequelize.define(
  "proche",
  {
    idProche: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomProche: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    prenomProche: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    NumTlfProche: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    mailProche: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = proche;
