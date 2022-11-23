const moment = require("moment");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const addAppointment = async (req, res) => {
  try {
    const body = await validateBody("addAppointment", req.body);

    body.created_at = moment().format();
    await query.insertAppointment(body);

    res.sendStatus(201);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateAppointment = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("validDate", req.body);

    body.updated_at = moment().format();

    const updateQuery = await query.updateAppointment(body, params);
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deleteQuery = await query.deleteAppointment(params.id);
    if (deleteQuery.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const archiveAppointment = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const body = await validateBody("validId", req.body);

    const appointment = await query.selectAppointmentById(body.id);
    if (appointment == null)
      return res.status(400).send({ type: "row_not_found" });
    params.date = appointment.date;
    await query.insertAppointmentJournal(params);

    await query.deleteAppointment(body.id);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getAppointment = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    res.send({ result: await query.selectAppointmentById(params.id) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getAppointmentList = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);

    res.send({ results: await query.getAppointmentList(params) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getAppointmentJournal = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);

    res.send({ results: await query.getAppointmentJournal(params.id_patient) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  archiveAppointment,
  getAppointment,
  getAppointmentList,
  getAppointmentJournal,
};
