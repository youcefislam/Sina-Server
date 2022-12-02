const { dbPool, queryErrorHandler } = require("../../Database/Connection");

const selectAllCommune = ({ page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT * FROM commune ORDER BY name LIMIT ?,?;SELECT count(*) as size FROM commune;";
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
              `The entered data might be incorrect`
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
