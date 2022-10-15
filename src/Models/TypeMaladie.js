const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const typeMaladie = sequelize.define(
  "typeMaladie",
  {
    idTypeMaladie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TypeMaladie: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = typeMaladie;
