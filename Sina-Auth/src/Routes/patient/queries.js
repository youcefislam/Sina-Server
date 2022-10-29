const mysql = require("mysql");
const moment = require("moment");
const dbPool = require("../../Database/connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const insertPatient = (info) =>
  new Promise((resolve, reject) => {
    info.created_at = moment().format();
    delete info?.repeat_password;

    let statement = "INSERT INTO patient SET ?;";
    dbPool.query(statement, info, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("patient.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result.insertId);
    });
  });

const insertPatientNotVerified = (id, validation_code) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO patient_account_validation VALUES (?,?);";
    dbPool.query(statement, [id, validation_code], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result.insertId);
    });
  });

const deletePatient = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM patient WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result.insertId);
    });
  });

const updatePatient = async (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE patient SET ? WHERE ?;`;
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        else if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              `no data found with the entered data`
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });

const selectPatient_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM patient WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });

const insertPatientLogInfo = (logInfo) =>
  new Promise((resolve, reject) => {
    let statement = `INSERT INTO patient_login_info SET ?`;
    dbPool.query(statement, logInfo, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result.insertId);
    });
  });

const selectPatientLogInfo = (patientInfo) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM patient_login_info WHERE ?;`;
    dbPool.query(statement, patientInfo, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const deletePatientLogInfo = (id) =>
  new Promise((resolve, reject) => {
    let statement = `DELETE FROM patient_login_info WHERE id=?;`;
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const selectValidationCode = (id) =>
  new Promise((resolve, reject) => {
    let statement =
      "SELECT validation_code FROM patient_account_validation WHERE id_patient = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]?.validation_code);
    });
  });
const deleteValidationCode = (id) =>
  new Promise((resolve, reject) => {
    let statement =
      "DELETE FROM patient_account_validation WHERE id_patient=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  insertPatient,
  insertPatientNotVerified,
  deletePatient,
  selectPatient_sensitive,
  selectValidationCode,
  updatePatient,
  insertPatientLogInfo,
  selectPatientLogInfo,
  deletePatientLogInfo,
  deleteValidationCode,
};
