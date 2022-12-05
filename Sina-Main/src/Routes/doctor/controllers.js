const utility = require("../../Utilities/utility");
const query = require("./queries.js");
const patientQuery = require("../patient/queries.js");
const { errorHandler } = require("../../Database/Connection");

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.params);

    if (doctor == null) return next(new errorHandler("raw_not_found"));

    const validPassword = await utility.comparePassword(
      req.body.password,
      doctor.password
    );

    if (!validPassword)
      return next(new errorHandler("incorrect_information", null, "password"));

    await query.deleteDoctor(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updateQuery = await query.updateDoctor(req.body, req.params);

    if (updateQuery.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const modifyPassword = async (req, res, next) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.params);

    if (doctor == null) return next(new errorHandler("raw_not_found"));

    const correctOldPassword = await utility.comparePassword(
      req.body.old_password,
      doctor.password
    );

    if (!correctOldPassword)
      return next(
        new errorHandler("incorrect_information", null, "old_password")
      );

    const newPassword = await utility.hashPassword(req.body.password);

    await query.updateDoctor({ password: newPassword }, req.params);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getPatientList = async (req, res, next) => {
  try {
    res.send(await query.selectPatientList(req.params.id, req.query));
  } catch (error) {
    next(error);
  }
};

const deleteFromPatientList = async (req, res, next) => {
  try {
    const updateQuery = await patientQuery.updatePatient(
      { id_doctor: null },
      { id: req.params.id_patient, id_doctor: req.params.id }
    );
    if (updateQuery.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    res.send({ results: await query.selectAllDoctor(req.query.page) });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    res.send({ result: await query.searchDoctor(req.params) });
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
