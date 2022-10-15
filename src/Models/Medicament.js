const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const medicament = sequelize.define(
  "medicament",
  {
    idMedicament: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomMedicament: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = medicament;
