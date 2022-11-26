const utility = require("../../Utilities/utility");
const query = require("./queries.js");
const patientQuery = require("../patient/queries.js");

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.params);

    if (doctor == null) return res.status(400).send({ code: "row_not_found" });

    const validPassword = await utility.comparePassword(
      req.body.password,
      doctor.password
    );

    if (!validPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "password" });

    await query.deleteDoctor(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const updateDoctor = async (req, res) => {
  try {
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updateQuery = await query.updateDoctor(req.body, req.params);

    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyPassword = async (req, res) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.params);

    if (doctor == null) return res.status(400).send({ code: "row_not_found" });

    const correctOldPassword = await utility.comparePassword(
      req.body.old_password,
      doctor.password
    );

    if (!correctOldPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "old_password" });

    const newPassword = await utility.hashPassword(req.body.password);

    await query.updateDoctor({ password: newPassword }, req.params);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getPatientList = async (req, res) => {
  try {
    res.send({
      results: await query.selectPatientList(req.params.id, req.query?.page),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteFromPatientList = async (req, res) => {
  try {
    const updateQuery = await patientQuery.updatePatient(
      { id_doctor: null },
      { id: req.params.id_patient, id_doctor: req.params.id }
    );
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getAllDoctors = async (req, res) => {
  try {
    res.send({ results: await query.selectAllDoctor(req.query.page) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getDoctorById = async (req, res) => {
  try {
    res.send({ result: await query.searchDoctor(req.params) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const searchDoctor = async (req, res) => {
  try {
    res.send({ results: await query.searchDoctor(req.query) });
  } catch (error) {
    res.sendStatus(500);
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
