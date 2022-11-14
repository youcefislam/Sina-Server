const dbPool = require("../../Database/Connection");
const moment = require("moment");
const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const addInfo = async (req, res) => {
  try {
    const body = await validateBody("patientInfo", req.body);
    const params = await validateBody("validId", req.params);

    body.birth_date = moment.parseZone(body.birth_date).format();
    const updatedPatient = await query.updatePatient(body, params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const body = await validateBody("validPassword", req.body);
    const params = await validateBody("validId", req.params);

    const patient = await query.selectPatient_sensitive(params);

    if (patient == null) return res.status(400).send({ type: "raw_not_found" });

    const validPassword = await utility.comparePassword(
      body.password,
      doctor.password
    );

    if (!validPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "password" });

    await query.deletePatientAccount(params.id);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const modifyMail = async (req, res) => {
  try {
    const body = await validateBody("validMail", req.body);
    const params = await validateBody("validId", req.params);

    const updatedPatient = await query.updatePatient(body, params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

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

    const updatedPatient = await query.updatePatient(body, req.params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

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

    const correctOldPassword = await utility.comparePassword(
      body.old_password,
      patient.password
    );

    if (!correctOldPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "old_password" });

    const newPassword = await utility.hashPassword(body.password);

    const updatedPatient = await query.updatePatient(
      { password: newPassword },
      params
    );

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

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

    const updatedPatient = await query.updatePatient(body, params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

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

    body.phone_number = Number(body.phone_number);

    const updatedPatient = await query.updatePatient(body, params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

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

const modifyAddress = async (req, res) => {
  try {
    const body = await validateBody("validPatientAddress", req.body);
    const params = await validateBody("validId", req.params);

    const updatedPatient = await query.updatePatient(body, params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getPatientInfo = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    res.send({ result: await query.searchPatient(params) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getAllPatient = async (req, res) => {
  try {
    const options = await validateBody("page", req.query);
    res.send({ result: await query.selectAllPatient(options?.page) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  addInfo,
  deleteAccount,
  modifyMail,
  modifyUsername,
  modifyPassword,
  modifyName,
  modifyNumber,
  modifyAddress,
  getPatientInfo,
  getAllPatient,
};
