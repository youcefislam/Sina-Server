const moment = require("moment");
const query = require("./queries");

const addAppointment = async (req, res) => {
  try {
    req.body.created_at = moment().format();
    await query.insertAppointment(req.body);

    res.sendStatus(201);
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateAppointment = async (req, res) => {
  try {
    req.body.updated_at = moment().format();

    const updateQuery = await query.updateAppointment(req.body, req.params);
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ code: "raw_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const deleteQuery = await query.deleteAppointment(req.params.id);
    if (deleteQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const archiveAppointment = async (req, res) => {
  try {
    const appointment = await query.selectAppointmentById(req.body.id);
    if (appointment == null)
      return res.status(400).send({ code: "row_not_found" });
    req.params.date = appointment.date;
    await query.insertAppointmentJournal(req.params);

    await query.deleteAppointment(req.body.id);
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getAppointment = async (req, res) => {
  try {
    res.send({ result: await query.selectAppointmentById(req.params.id) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getAppointmentList = async (req, res) => {
  try {
    res.send(await query.getAppointmentList(req.params.id_patient, req.query));
  } catch (error) {
    res.sendStatus(500);
  }
};

const getAppointmentJournal = async (req, res) => {
  try {
    res.send(
      await query.getAppointmentJournal(req.params.id_patient, req.query)
    );
  } catch (error) {
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
