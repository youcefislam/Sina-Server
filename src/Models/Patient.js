const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const typeMaladie = require("./TypeMaladie");
const commune = require("./Commune");
const medecin = require("./Medecin");
const proche = require("./Proche");

const patient = sequelize.define(
  "patient",
  {
    idPatient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userNamePatient: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    passwordPatient: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomPatient: {
      type: DataTypes.STRING(50),
    },
    prenomPatient: {
      type: DataTypes.STRING(50),
    },
    sexePatient: {
      type: DataTypes.BOOLEAN,
    },
    autoAccept: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dateNaisPatient: {
      type: DataTypes.DATE,
    },
    dateInscriptionPatient: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    NumTlfPatient: {
      type: DataTypes.STRING(10),
      unique: true,
    },
    lienJournalMedicament: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    lienHistoriqueRV: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    mailPatient: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    idTypeMaladie: {
      type: DataTypes.INTEGER,
      references: {
        model: "typeMaladie",
        key: "idTypeMaladie",
      },
    },
    idCommune: {
      type: DataTypes.INTEGER,
      references: {
        model: "daira",
        key: "idDaira",
      },
    },
    idMedecin: {
      type: DataTypes.INTEGER,
      references: {
        model: "medecin",
        key: "idMedecin",
      },
    },
    idProche: {
      type: DataTypes.INTEGER,
      references: {
        model: "proche",
        key: "idProche",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

typeMaladie.hasMany(patient, {
  as: "patient",
  foreignKey: "idTypeMaladie",
  onDelete: "SET NULL",
});
patient.belongsTo(typeMaladie, {
  as: "typeMaladie",
  foreignKey: "idTypeMaladie",
});

commune.hasMany(patient, {
  as: "patient",
  foreignKey: "idCommune",
  onDelete: "SET NULL",
});
patient.belongsTo(commune, {
  as: "commune",
  foreignKey: "idCommune",
});

medecin.hasMany(patient, {
  as: "patient",
  foreignKey: "idMedecin",
  onDelete: "SET NULL",
});
patient.belongsTo(medecin, {
  as: "medecin",
  foreignKey: "idMedecin",
});

proche.hasOne(patient, {
  as: "patient",
  foreignKey: "idProche",
  onDelete: "SET NULL",
});
patient.belongsTo(proche, {
  as: "proche",
  foreignKey: "idProche",
});

module.exports = patient;
