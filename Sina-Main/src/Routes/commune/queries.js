const { dbPool } = require("../../Database/Connection");

function queryErrorHandler(type, message) {
  this.type = type;
  this.message = message;
}

const selectAllCommune = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM commune;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertCommune = (commune) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO commune SET ?";
    dbPool.query(statement, commune, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("commune.", "")
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
const updateCommune = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = "update commune SET ? WHERE ?;";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("commune.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteCommune = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM commune WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectAllCommune,
  insertCommune,
  updateCommune,
  deleteCommune,
};
