const mysql = require("mysql");
const dbPool = require("../../Database/connection");

function queryErrorHandler(type, message, path) {
  this.type = type;
  this.message = message;
  this.path = path;
}

const selectDoctor_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctor WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });

const selectAllDoctor = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM doctorView;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

const deleteDoctor = (id_doctor) =>
  new Promise((resolve, reject) => {
    const statement = `DELETE FROM doctor WHERE id=?;`;
    dbPool.query(statement, id_doctor, (dbErr, result) => {
      if (dbErr) reject();
      else resolve();
    });
  });

const updateDoctor = (newValue, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE doctor SET ? WHERE ?;`;
    dbPool.query(statement, [newValue, options], (dbErr, result) => {
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

const selectPatientList = (id_doctor) =>
  new Promise((resolve, reject) => {
    const statement = `SELECT * FROM patientView WHERE id_doctor=?;`;
    dbPool.query(statement, id_doctor, (dbErr, results) => {
      if (dbErr) reject(dbErr);
      else resolve(results);
    });
  });

const searchDoctor = (query) =>
  new Promise((resolve, reject) => {
    let statement = mysql
      .format(`SELECT * FROM doctorView WHERE ?;`, query)
      .replace(",", ` AND`);
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

module.exports = {
  selectAllDoctor,
  deleteDoctor,
  updateDoctor,
  selectPatientList,
  selectDoctor_sensitive,
  searchDoctor,
};
