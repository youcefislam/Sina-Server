const { dbPool } = require("../../Database/connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const selectRelative = (id) =>
  new Promise((resolve, reject) => {
    let statement =
      "SELECT r.first_name,r.last_name,r.phone_number,r.mail FROM patient p,relative r WHERE p.id=? and p.id_relative=r.id;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const insertRelative = (info) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO relative SET ?;";
    dbPool.query(statement, info, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("relative.", "")
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
const deleteMyRelative = (id_patient) =>
  new Promise((resolve, reject) => {
    let statement =
      "DELETE FROM relative WHERE id IN (select id_relative from patient where patient.id=4);";
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
            new queryErrorHandler(
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
