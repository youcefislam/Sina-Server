const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const wilaya = require("./Wilaya");

const daira = sequelize.define(
  "daira",
  {
    idDaira: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomDaira: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    idWilaya: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "wilaya",
        key: "idWilaya",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

wilaya.hasMany(daira, {
  as: "daira",
  foreignKey: "idWilaya",
  onDelete: "CASCADE",
});
daira.belongsTo(wilaya, { as: "wilaya", foreignKey: "idWilaya" });

module.exports = daira;
