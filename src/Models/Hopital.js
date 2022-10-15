const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const commune = require("./Commune");

const hopital = sequelize.define(
  "Hopital",
  {
    idHopital: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomHopital: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    adressHopital: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    numTlfHopital: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    idCommune: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "commune",
        key: "idCommune",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

commune.hasMany(hopital, {
  as: "hopital",
  foreignKey: "idCommune",
  onDelete: "CASCADE",
});
hopital.belongsTo(commune, { as: "commune", foreignKey: "idCommune" });

module.exports = hopital;
