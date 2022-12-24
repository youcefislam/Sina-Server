const { dbPool, errorHandler } = require("../../database/connection");

const selectRelative = (id) =>
  new Promise((resolve, reject) => {
    let statement =
      "SELECT first_name,last_name,phone_number,mail,id_patient FROM relative WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const insertRelative = (info) =>
  new Promise((resolve, reject) => {
    delete info.id;
    let statement = "INSERT INTO relative SET ?;";
    dbPool.query(statement, info, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("relative.", "")
            )
          );
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
              "invalid_data",
              "The entered data might be incorrect."
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteRelative = (id_relative) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM relative WHERE id=?;";
    dbPool.query(statement, id_relative, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const deleteMyRelative = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM relative WHERE id = ?;";
    dbPool.query(statement, id_patient, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });

const updateRelative = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement =
      "UPDATE relative SET ? WHERE id IN (SELECT id_relative FROM patient WHERE ?);";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("relative.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
module.exports = {
  selectRelative,
  insertRelative,
  deleteRelative,
  deleteMyRelative,
  updateRelative,
};
