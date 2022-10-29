const validateBody = require("../../Utilities/validations");
const utility = require("../../Utilities/utility");
const query = require("./queries.js");
const patientQuery = require("../patient/queries.js");

const deleteDoctor = async (req, res) => {
  try {
    const body = await validateBody("validPassword", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    const validPassword = await utility.comparePassword(
      body.password,
      doctor.password
    );

    if (!validPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "password" });

    await query.deleteDoctor(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyMail = async (req, res) => {
  try {
    const body = await validateBody("validMail", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyUsername = async (req, res) => {
  try {
    const body = await validateBody("validUsername", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyPassword = async (req, res) => {
  try {
    const body = await validateBody("validNewPassword", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    const correctOldPassword = await utility.comparePassword(
      body.old_password,
      doctor.password
    );

    if (!correctOldPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "old_password" });

    const newPassword = await utility.hashPassword(body.password);

    await query.updateDoctor({ password: newPassword }, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyName = async (req, res) => {
  try {
    const body = await validateBody("validName", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyNumber = async (req, res) => {
  try {
    const body = await validateBody("validNumber", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    body.phone_number = Number(body.phone_number);

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyAutoAccept = async (req, res) => {
  try {
    const body = await validateBody("validAccept", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getPatientList = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    res.send({ results: await query.selectPatientList(req.params.id) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const removeFromPatientList = async (req, res) => {
  try {
    const params = await validateBody("validPatientFromList", req.params);

    const patient = await patientQuery.searchPatient({
      id: params.id_patient,
    });

    if (patient == null)
      return res.status(400).send({ type: "no_patient_found" });

    if (patient.id_doctor != params.id)
      return res.status(403).send({ type: "incorrect_information" });

    await patientQuery.updatePatient(
      { id_doctor: null },
      { id: params.id_patient }
    );
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getAllDoctors = async (req, res) => {
  try {
    res.send({ results: await query.selectAllDoctor() });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getDoctorById = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    res.send({ result: await query.searchDoctor(params) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const searchDoctor = async (req, res) => {
  try {
    const searchQuery = await validateBody("doctorSearchQuery", req.query);
    res.send({ results: await query.searchDoctor(searchQuery) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyAddress = async (req, res) => {
  try {
    const body = await validateBody("validDoctorAddress", req.body);
    const params = await validateBody("validId", req.params);

    const doctor = await query.selectDoctor_sensitive(params);

    if (doctor == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updateDoctor(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  deleteDoctor,
  modifyMail,
  modifyUsername,
  modifyPassword,
  modifyName,
  modifyNumber,
  modifyAutoAccept,
  modifyAddress,
  getPatientList,
  removeFromPatientList,
  getAllDoctors,
  getDoctorById,
  searchDoctor,
};
