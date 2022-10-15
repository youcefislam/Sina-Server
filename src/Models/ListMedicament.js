const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");
const medicament = require("./Medicament");

const listMedicament = sequelize.define(
  "listMedicament",
  {
    idPatient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "patient",
        key: "idPatient",
      },
    },
    idMedicament: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "medicament",
        key: "idMedicament",
      },
    },
    posologie: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dateInscriptientMedecin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

patient.hasMany(listMedicament, {
  as: "listMedicament",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
listMedicament.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

medicament.hasMany(listMedicament, {
  as: "listMedicament",
  foreignKey: "idMedicament",
  onDelete: "CASCADE",
});
listMedicament.belongsTo(medicament, {
  as: "medicament",
  foreignKey: "idMedicament",
});

module.exports = listMedicament;
