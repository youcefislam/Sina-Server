const mysql = require("mysql");
const moment = require("moment");
const { dbPool } = require("../../Database/connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const deletePatientAccount = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM patient WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result.insertId);
    });
  });

const updatePatient = async (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE patient SET ? WHERE ?;`;
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        else if (dbErr.errno == 1452)
          reject(
            new queryErrorHandler(
              "invalid_data",
              `no data found with the entered data`
            )
          );
        else reject(dbErr);
      } else resolve(result);
    });
  });

const selectPatient_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM patient WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });
const searchPatient = (query) =>
  new Promise((resolve, reject) => {
    const statement = mysql
      .format(`SELECT * FROM patientView WHERE ?;`, query)
      .replace(",", ` AND`);
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

module.exports = {
  selectPatient_sensitive,
  searchPatient,
  updatePatient,
  deletePatientAccount,
};
