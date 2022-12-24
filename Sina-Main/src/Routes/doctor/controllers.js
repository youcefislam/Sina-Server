const utility = require("../../utilities/utility");
const query = require("./queries.js");
const patientQuery = require("../patient/queries.js");
const { errorHandler } = require("../../database/connection");

const deleteDoctor = async (req, res, next) => {
  try {
    const validPassword = await utility.comparePassword(
      req.body.password,
      req.autData.password
    );

    if (!validPassword)
      return next(new errorHandler("incorrect_information", null, "password"));

    await query.deleteDoctor(req.params[0]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updateQuery = await query.updateDoctor(req.body, {
      id: req.params[0],
    });

    if (!updateQuery.affectedRows)
      return next(new errorHandler("row_not_found"));

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

    await query.updateDoctor({ password: newPassword }, { id: req.params[0] });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getPatientList = async (req, res, next) => {
  try {
    res.send(await query.selectPatientList(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

const deleteFromPatientList = async (req, res, next) => {
  try {
    const updateQuery = await patientQuery.updatePatient(
      { id_doctor: null },
      { id_doctor: req.params[0], id: req.params[1] }
    );
    if (!updateQuery.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    res.send(await query.selectAllDoctor(req.query.page));
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    res.send(await query.searchDoctor({ id: req.params[0], ...req.query }));
  } catch (error) {
    next(error);
  }
};

const searchDoctor = async (req, res, next) => {
  try {
    res.send(await query.searchDoctor(req.query));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteDoctor,
  updateDoctor,
  modifyPassword,
  getPatientList,
  deleteFromPatientList,
  getAllDoctors,
  getDoctorById,
  searchDoctor,
};
