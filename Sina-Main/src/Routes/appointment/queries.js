const {
  dbPool,
  queryErrorHandler,
  formulateAndQuery,
} = require("../../Database/Connection");

const insertAppointment = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO appointment SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              "The entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const selectAppointmentById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM appointment WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const updateAppointment = (newValues, query) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE appointment SET ? WHERE ?;";
    dbPool.query(statement, [newValues, query], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const deleteAppointment = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM  appointment WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const getAppointmentList = (query) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery(
      "SELECT * FROM appointment WHERE ?;",
      query
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const getAppointmentJournal = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM appointment_journal WHERE id_patient=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertAppointmentJournal = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO appointment_journal SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              "The entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteAppointmentJournal = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM appointment_journal WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  insertAppointment,
  selectAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentList,
  getAppointmentJournal,
  insertAppointmentJournal,
  deleteAppointmentJournal,
};
