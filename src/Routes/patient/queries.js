const sequelize = require("sequelize");
const patient = require("../../Models/Patient");

function queryErrorHandler(type, error) {
  this.type = type;
  this.path = error.path;
}

const updatePatient = async (newValues, options) => {
  try {
    await patient.update(newValues, {
      where: options,
    });
  } catch (error) {
    if (error instanceof sequelize.UniqueConstraintError)
      throw new queryErrorHandler("duplicated_entry_error", error.errors[0]);
    else if (error instanceof sequelize.ForeignKeyConstraintError)
      throw new queryErrorHandler("invalid_data", { path: error.fields[0] });
    else throw new Error(error);
  }
};

module.exports = {
  updatePatient,
};
