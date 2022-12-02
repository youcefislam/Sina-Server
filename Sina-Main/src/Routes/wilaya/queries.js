const { dbPool, queryErrorHandler } = require("../../Database/Connection");

const selectAllWilaya = ({ page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    let pagination = page * limit - limit;
    let statement =
      "SELECT * FROM wilaya ORDER BY name LIMIT ?,?;SELECT count(*) as size FROM wilaya;";
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

const selectWilaya = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM wilaya WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
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
  selectWilaya,
  insertWilaya,
  updateWilaya,
  deleteWilaya,
};
