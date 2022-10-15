const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");

const patientNonVerifie = sequelize.define(
  "patientNonVerifie",
  {
    idPatient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: "patient",
        key: "idPatient",
      },
    },
    validationCode: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

patient.hasOne(patientNonVerifie, {
  as: "patientNonVerifie",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
patientNonVerifie.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

module.exports = patientNonVerifie;
