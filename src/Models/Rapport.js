const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const patient = require("./Patient");

const rapport = sequelize.define(
  "rapport",
  {
    idRapport: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lienRapport: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    dateRapport: {
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

patient.hasMany(rapport, {
  as: "rapport",
  foreignKey: "idPatient",
  onDelete: "CASCADE",
});
rapport.belongsTo(patient, {
  as: "patient",
  foreignKey: "idPatient",
});

module.exports = rapport;
