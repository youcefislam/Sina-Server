const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");

const rendezvous = sequelize.define(
  "rendezvous",
  {
    idRendezVous: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateRV: {
      type: DataTypes.DATE,
      allowNull: false,
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

patient.hasMany(rendezvous, {
  as: "rendezvous",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
rendezvous.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

module.exports = rendezvous;
