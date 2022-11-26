const { dbPool, formulateAndQuery } = require("../../Database/connection");

function queryErrorHandler(code, message, path) {
  this.code = code;
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

const selectAllDoctor = (page = 1) =>
  new Promise((resolve, reject) => {
    const pagination = page * 5 - 5;
    let statement =
      "SELECT * FROM doctorView ORDER BY first_name, last_name LIMIT ?,5;";
    dbPool.query(statement, pagination, (dbErr, result) => {
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
              `The entered data might be incorrect`
            )
          );
        return reject(dbErr);
      }
      return resolve(result);
    });
  });

const selectPatientList = (id_doctor, page = 1) =>
  new Promise((resolve, reject) => {
    const pagination = page * 5 - 5;
    const statement = `SELECT * FROM patientView WHERE id_doctor=? ORDER BY first_name, last_name LIMIT ?,5;`;
    dbPool.query(statement, [id_doctor, pagination], (dbErr, results) => {
      if (dbErr) reject(dbErr);
      else resolve(results);
    });
  });

const searchDoctor = (query) =>
  new Promise((resolve, reject) => {
    let pagination = query.page ? query.page : 1 * 5 - 5;
    delete query.page;
    let statement = formulateAndQuery(
      `SELECT * FROM doctorView WHERE ?`,
      query
    );
    statement += " ORDER BY first_name,last_name LIMIT ?,5;";
    dbPool.query(statement, pagination, (dbErr, result) => {
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
