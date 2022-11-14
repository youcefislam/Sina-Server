const { dbPool, formulateAndQuery } = require("../../Database/Connection");

function queryErrorHandler(type, message, path) {
  this.type = type;
  this.message = message;
  this.path = path;
}

const selectWaitingList = (id_doctor, page = 1) =>
  new Promise((resolve, reject) => {
    const pagination = page * 5 - 5;
    const statement = `SELECT p.id,p.mail,p.first_name,p.last_name from patient_request rq,patient p WHERE rq.id_doctor = ? AND p.id = rq.id_patient ORDER BY p.first_name,p.last_name LIMIT ?,5;`;
    dbPool.query(statement, [id_doctor, pagination], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertRequest = (request) =>
  new Promise((resolve, reject) => {
    let statement = `INSERT INTO patient_request SET ?;`;
    dbPool.query(statement, request, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              "request already sent"
            )
          );
        else if (dbErr.errno == 1452)
          return reject(
            new queryErrorHandler(
              "invalid_data",
              "The entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const selectRequest = (patientRequest) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery(
      "SELECT * from patient_request where ?;",
      patientRequest
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const deleteRequest = (request) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery(
      "DELETE FROM patient_request WHERE ?",
      request
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });

module.exports = {
  selectWaitingList,
  insertRequest,
  selectRequest,
  deleteRequest,
};
