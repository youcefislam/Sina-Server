const moment = require("moment");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const addAppointment = async (req, res, next) => {
  try {
    req.body.created_at = moment().format();
    await query.insertAppointment(req.body);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    req.body.updated_at = moment().format();

    const updateQuery = await query.updateAppointment(req.body, req.params);
    if (updateQuery.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const deleteQuery = await query.deleteAppointment(req.params.id);
    if (deleteQuery.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const archiveAppointment = async (req, res, next) => {
  try {
    const appointment = await query.selectAppointmentById(req.body.id);
    if (appointment == null) return next(new errorHandler("raw_not_found"));

    req.params.date = appointment.date;
    await query.insertAppointmentJournal(req.params);

    await query.deleteAppointment(req.body.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getAppointment = async (req, res, next) => {
  try {
    res.send({ result: await query.selectAppointmentById(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const getAppointmentList = async (req, res, next) => {
  try {
    res.send(await query.getAppointmentList(req.params.id_patient, req.query));
  } catch (error) {
    next(error);
  }
};

const getAppointmentJournal = async (req, res, next) => {
  try {
    res.send(
      await query.getAppointmentJournal(req.params.id_patient, req.query)
    );
  } catch (error) {
    next(error);
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
