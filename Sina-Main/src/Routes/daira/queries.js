const { dbPool, queryErrorHandler } = require("../../Database/Connection");

const selectAllDaira = (page = 1) =>
  new Promise((resolve, reject) => {
    const pagination = page * 5 - 5;
    let statement = "SELECT * FROM daira ORDER BY name LIMIT ?,5;";
    dbPool.query(statement, pagination, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const selectDaira = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM daira WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
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
        else if (dbErr.errno == 1452)
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
