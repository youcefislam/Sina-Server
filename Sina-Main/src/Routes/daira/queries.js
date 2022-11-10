const { dbPool } = require("../../Database/Connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const selectAllDaira = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM daira;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertDaira = (daira) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO daira SET ?";
    dbPool.query(statement, daira, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("daira.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const updateDaira = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = "update daira SET ? WHERE ?;";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("daira.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteDaira = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM daira WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectAllDaira,
  insertDaira,
  updateDaira,
  deleteDaira,
};
