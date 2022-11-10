const { dbPool } = require("../../Database/Connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const selectAllWilaya = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM wilaya;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertWilaya = (wilaya) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO wilaya SET ?";
    dbPool.query(statement, wilaya, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("wilaya.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const updateWilaya = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = "update wilaya SET ? WHERE ?;";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("wilaya.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteWilaya = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM wilaya WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectAllWilaya,
  insertWilaya,
  updateWilaya,
  deleteWilaya,
};
