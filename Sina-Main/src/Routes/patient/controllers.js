const moment = require("moment");
const query = require("./queries");
const utility = require("../../utilities/utility");
const { errorHandler } = require("../../database/connection");

const updatePatient = async (req, res, next) => {
  try {
    if (req.body.birth_date)
      req.body.birth_date = moment
        .parseZone(req.body.birth_date)
        .format()
        .split("T")[0];
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updatedPatient = await query.updatePatient(req.body, {
      id: req.params[0],
    });

    if (!updatedPatient.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const validPassword = await utility.comparePassword(
      req.body.password,
      req.autData.password
    );

    if (!validPassword)
      return next(new errorHandler("incorrect_information", null, "password"));

    await query.deletePatientAccount(req.params[0]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const modifyPassword = async (req, res, next) => {
  try {
    const correctOldPassword = await utility.comparePassword(
      req.body.old_password,
      req.autData.password
    );
    if (!correctOldPassword)
      return next(
        new errorHandler("incorrect_information", null, "old_password")
      );

    const newPassword = await utility.hashPassword(req.body.password);

    const updatedPatient = await query.updatePatient(
      { password: newPassword },
      { id: req.params[0] }
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getPatientInfo = async (req, res, next) => {
  try {
    res.send({ result: await query.searchPatient({ id: req.params[0] }) });
  } catch (error) {
    next(error);
  }
};

const getAllPatient = async (req, res, next) => {
  try {
    res.send(await query.selectAllPatient(req.query));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePatient,
  deleteAccount,
  modifyPassword,
  getPatientInfo,
  getAllPatient,
};
