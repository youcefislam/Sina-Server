const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");

const noteMedecin = sequelize.define(
  "noteMedecin",
  {
    idNote: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NoteMedecin: {
      type: DataTypes.STRING(1000),
    },
    DateNote: {
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

patient.hasMany(noteMedecin, {
  as: "noteMedecin",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
noteMedecin.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

module.exports = noteMedecin;
