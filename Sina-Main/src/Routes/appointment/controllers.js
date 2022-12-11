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

    const updateQuery = await query.updateAppointment(req.body, {
      id: req.params[0],
    });
    if (!updateQuery.affectedRows)
      return next(new errorHandler("row_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const deleteQuery = await query.deleteAppointment(req.params[0]);
    if (!deleteQuery.affectedRows)
      return next(new errorHandler("row_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const archiveAppointment = async (req, res, next) => {
  try {
    const appointment = await query.selectAppointmentById(req.body.id);
    if (!appointment) return next(new errorHandler("row_not_found"));

    await query.insertAppointmentJournal({
      id_patient: req.params[0],
      date: appointment.date,
    });

    await query.deleteAppointment(req.body.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getAppointment = async (req, res, next) => {
  try {
    res.send({
      result: await query.selectAppointmentById(req.params[0]),
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentList = async (req, res, next) => {
  try {
    res.send(await query.getAppointmentList(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

const getAppointmentJournal = async (req, res, next) => {
  try {
    res.send(await query.getAppointmentJournal(req.params[0], req.query));
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
