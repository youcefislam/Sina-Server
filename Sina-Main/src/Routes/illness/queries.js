const { dbPool } = require("../../Database/Connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const selectAllIllnessTypes = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM illness_type;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertIllnessType = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO illness_type SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("illness_type.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const selectIllnessType = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT type FROM illness_type WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });

const updateIllness = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE illness_type SET ? WHERE ?;";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("illness_type.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteIllness = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM illness_type WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectAllIllnessTypes,
  insertIllnessType,
  selectIllnessType,
  deleteIllness,
  updateIllness,
};
