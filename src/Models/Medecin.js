const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const daira = require("./Daira");

const medecin = sequelize.define(
  "medecin",
  {
    idMedecin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userNameMedecin: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    passwordMedecin: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomMedecin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    prenomMedecin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sexeMedecin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    autoAccept: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dateInscriptientMedecin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    NumTlfMedecin: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    mailMedecin: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    idDaira: {
      type: DataTypes.INTEGER,
      references: {
        model: "daira",
        key: "idDaira",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

daira.hasMany(medecin, {
  as: "medecin",
  foreignKey: "idDaira",
  onDelete: "SET NULL",
});
medecin.belongsTo(daira, {
  as: "daira",
  foreignKey: "idDaira",
});

module.exports = medecin;
