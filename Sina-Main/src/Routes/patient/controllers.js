const moment = require("moment");
const query = require("./queries");
const utility = require("../../Utilities/utility");
const { errorHandler } = require("../../Database/Connection");

const updatePatient = async (req, res, next) => {
  try {
    if (req.body.birth_date)
      req.body.birth_date = moment
        .parseZone(req.body.birth_date)
        .format()
        .split("T")[0];
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updatedPatient = await query.updatePatient(req.body, req.params);

    if (updatedPatient.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null) return next(new errorHandler("raw_not_found"));

    const validPassword = await utility.comparePassword(
      req.body.password,
      patient.password
    );

    if (!validPassword)
      return next(new errorHandler("incorrect_information", null, "password"));

    await query.deletePatientAccount(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const modifyPassword = async (req, res, next) => {
  try {
    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null) return next(new errorHandler("raw_not_found"));

    const correctOldPassword = await utility.comparePassword(
      req.body.old_password,
      patient.password
    );
    if (!correctOldPassword)
      return next(
        new errorHandler("incorrect_information", null, "old_password")
      );

    const newPassword = await utility.hashPassword(req.body.password);

    const updatedPatient = await query.updatePatient(
      { password: newPassword },
      req.params
    );

    if (updatedPatient.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getPatientInfo = async (req, res, next) => {
  try {
    res.send({ result: await query.searchPatient(req.params) });
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
