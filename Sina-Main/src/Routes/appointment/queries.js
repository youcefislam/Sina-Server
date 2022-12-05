const {
  dbPool,
  errorHandler,
  formulateAndQuery,
} = require("../../Database/Connection");

const insertAppointment = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO appointment SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
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
const getAppointmentList = (id_patient, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    let pagination = page * limit - limit;
    let statement =
      "SELECT * FROM appointment WHERE id_patient = ? ORDER BY date LIMIT ?,?;SELECT count(*) as size FROM appointment WHERE id_patient = ?;";
    dbPool.query(
      statement,
      [id_patient, pagination, limit, id_patient],
      (dbErr, result) => {
        if (dbErr) return reject(dbErr);
        const maxPage = Math.ceil(result[1][0].size / limit);
        resolve({
          Results: result[0],
          Pagination: {
            page,
            nextPage: page < maxPage ? ++page : -1,
            limit,
            maxPage,
          },
        });
      }
    );
  });
const getAppointmentJournal = (id, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    let pagination = page * limit - limit;
    let statement =
      "SELECT * FROM appointment_journal WHERE id_patient = ? ORDER BY date LIMIT ?,?; SELECT count(*) as size FROM appointment_journal WHERE id_patient = ?";
    dbPool.query(statement, [id, pagination, limit, id], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      const maxPage = Math.ceil(result[1][0].size / limit);
      resolve({
        Results: result[0],
        Pagination: {
          page,
          nextPage: page < maxPage ? ++page : -1,
          limit,
          maxPage,
        },
      });
    });
  });
const insertAppointmentJournal = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO appointment_journal SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
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
