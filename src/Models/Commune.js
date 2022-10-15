const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const daira = require("./Daira");

const commune = sequelize.define(
  "commune",
  {
    idCommune: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomCommune: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    idDaira: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "daira",
        key: "idDaira",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

daira.hasMany(commune, {
  as: "commune",
  foreignKey: "idDaira",
  onDelete: "CASCADE",
});
commune.belongsTo(daira, { as: "daira", foreignKey: "idDaira" });

module.exports = commune;
