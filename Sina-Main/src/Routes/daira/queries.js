const { dbPool, errorHandler } = require("../../database/connection");

const selectAllDaira = ({ page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT * FROM daira ORDER BY name LIMIT ?,?;SELECT count(*) as size FROM daira;";
    dbPool.query(statement, [pagination, limit], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      const maxPage = Math.ceil(result[1][0].size / limit);
      resolve({
        Results: result[0],
        Pagination: {
          page,
          nextPage: page < maxPage ? ++page : -1,
          limit,
          maxPage,
        },
      });
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
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("daira.", "")
            )
          );
        else if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
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
            new errorHandler(
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
