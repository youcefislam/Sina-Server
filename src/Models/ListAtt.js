const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");
const medecin = require("./Medecin");

const listAtt = sequelize.define(
  "listAtt",
  {
    idPatient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "patient",
        key: "idPatient",
      },
    },
    idMedecin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medecin",
        key: "idMedecin",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

patient.hasOne(listAtt, {
  as: "listAtt",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
listAtt.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

medecin.hasMany(listAtt, {
  as: "listAtt",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
listAtt.belongsTo(medecin, {
  as: "medecin",
  foreignKey: "idMedecin",
});

module.exports = listAtt;
