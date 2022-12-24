const moment = require("moment");
const { dbPool, queryErrorHandler } = require("../../database/connection");

const insertDoctor = (info) =>
  new Promise((resolve, reject) => {
    info.created_at = moment().format();
    delete info.repeat_password;

    let statement = `INSERT INTO doctor SET ?;`;

    dbPool.query(statement, info, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result.insertId);
    });
  });

const insertDoctorNotVerified = async (id_doctor) =>
  new Promise((resolve, reject) => {
    statement = "INSERT INTO doctor_account_validation VALUES(?);";
    dbPool.query(statement, id_doctor, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result.insertId);
    });
  });

const deleteDoctor = (id_doctor) =>
  new Promise((resolve, reject) => {
    const statement = `DELETE FROM doctor WHERE id=?;`;
    dbPool.query(statement, id_doctor, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });

const updateDoctor = (newValue, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE doctor SET ? WHERE ?;`;
    dbPool.query(statement, [newValue, options], (dbErr, result) => {
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

const selectDoctor_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctor WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });

const insertDoctorLogInfo = (logInfo) =>
  new Promise((resolve, reject) => {
    let statement = `INSERT INTO doctor_login_info SET ?`;
    dbPool.query(statement, logInfo, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result.insertId);
    });
  });

const selectDoctorLoginInfo = (doctorInfo) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctor_login_info WHERE ?;`;
    dbPool.query(statement, doctorInfo, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const deleteDoctorLogInInfo = (id) =>
  new Promise((resolve, reject) => {
    let statement = `DELETE FROM doctor_login_info WHERE id=?;`;
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });

const selectNotVerifiedDoctor = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT id FROM doctor_account_validation WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });

const validateDoctorAccount = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM doctor_account_validation WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });

module.exports = {
  insertDoctor,
  insertDoctorNotVerified,
  deleteDoctor,
  insertDoctorLogInfo,
  selectDoctorLoginInfo,
  selectDoctor_sensitive,
  selectNotVerifiedDoctor,
  deleteDoctorLogInInfo,
  validateDoctorAccount,
  updateDoctor,
};
