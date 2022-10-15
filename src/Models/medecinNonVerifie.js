const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const medecin = require("./Medecin");

const medecinNonVerifie = sequelize.define(
  "medecinNonVerifie",
  {
    idMedecin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

medecin.hasOne(medecinNonVerifie, {
  as: "medecinNonVerifie",
  foreignKey: "idMedecin",
  onDelete: "CASCADE",
});
medecinNonVerifie.belongsTo(medecin, {
  as: "medecin",
  foreignKey: "idMedecin",
});

module.exports = medecinNonVerifie;
