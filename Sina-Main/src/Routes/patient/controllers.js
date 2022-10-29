const dbPool = require("../../Database/Connection");
const moment = require("moment");
const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const addInfo = async (req, res) => {
  try {
    const body = await validateBody("patientInfo", req.body);
    const params = await validateBody("validId", req.params);

    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    body.birth_date = moment.parseZone(body.birth_date).format();
    await query.updatePatientInfo(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const value = await validateBody("validId", req.params);
    await query.deletePatientAccount(value.id);
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

    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updatePatientInfo(body, params);
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

    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updatePatientInfo(body, req.params);
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

    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    const correctOldPassword = await utility.comparePassword(
      body.old_password,
      patient.password
    );

    if (!correctOldPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "old_password" });

    const newPassword = await utility.hashPassword(body.password);

    await query.updatePatientInfo({ password: newPassword }, params);
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

    const patient = await query.selectPatient_sensitive(params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updatePatientInfo(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }

  const { error, value } = await validateBody("validName", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE patient SET nomPatient=?,prenomPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.nom, value.prenom, req.autData.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const modifyNumber = async (req, res) => {
  try {
    const body = await validateBody("validNumber", req.body);
    const params = await validateBody("validId", req.params);

    const patient = await query.selectPatient_sensitive(params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    body.phone_number = Number(body.phone_number);

    await query.updatePatientInfo(body, params);
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

    const patient = await query.selectPatient_sensitive(params);

    if (patient == null)
      return res.status(400).send({ type: "no_account_found" });

    await query.updatePatientInfo(body, params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getPatientInfo = async (req, res) => {
  try {
    const value = await validateBody("validId", req.params);
    res.send({ result: await query.searchPatient(value) });
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
};
