const { dbPool, format } = require("../../Database/Connection");

const selectReportById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM medical_report WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const selectReportList = (id_patient, options, page = 1) =>
  new Promise((resolve, reject) => {
    let pagination = page * 5 - 5;
    delete options.page;
    let statement = "SELECT * FROM medical_report WHERE id_patient=?";
    if (options.created_at)
      statement += format(" AND created_at=?", options.created_at);
    statement += " ORDER BY created_at LIMIT ?,5;";
    dbPool.query(statement, [id_patient, pagination], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertReport = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO medical_report SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              "the entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteReport = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM medical_report WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectReportById,
  selectReportList,
  insertReport,
  deleteReport,
};
