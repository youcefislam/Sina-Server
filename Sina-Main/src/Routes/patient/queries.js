const {
  dbPool,
  formulateAndQuery,
  queryErrorHandler,
  format,
} = require("../../Database/connection");

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
    let statement = format(`UPDATE patient SET ?`, newValues);
    statement += formulateAndQuery(` WHERE ?;`, options);
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              `The entered data might be incorrect`
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
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });
const selectPatientMinimal = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM patientView WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });
const searchPatient = (query) =>
  new Promise((resolve, reject) => {
    const statement = formulateAndQuery(
      `SELECT * FROM patientViewDetailed WHERE ?;`,
      query
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

const selectAllPatient = (page = 1) =>
  new Promise((resolve, reject) => {
    const pagination = page * 5 - 5;
    let statement =
      "SELECT * FROM patientViewDetailed ORDER BY first_name,last_name LIMIT ?,5;";
    dbPool.query(statement, pagination, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  deletePatientAccount,
  updatePatient,
  selectPatient_sensitive,
  selectPatientMinimal,
  searchPatient,
  selectAllPatient,
};
