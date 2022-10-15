const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");

const fichierECG = sequelize.define(
  "fichierECG",
  {
    idFichierECG: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateCreation: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lienFichier: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patient",
        key: "idPatient",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

patient.hasMany(fichierECG, {
  as: "fichierECG",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
fichierECG.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

module.exports = fichierECG;
