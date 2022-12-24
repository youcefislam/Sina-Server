const {
  dbPool,
  format,
  formulateAndQuery,
  errorHandler,
} = require("../../database/connection");

const selectHospitals = (options) =>
  new Promise((resolve, reject) => {
    let page = options.page || 1;
    let limit = options.limit || 10;
    let pagination = page * limit - limit;
    delete options?.page;
    delete options?.limit;
    let statement = "SELECT * FROM hospital";
    let optionsQuery = "";
    if (Object.keys(options).length > 0) {
      optionsQuery += " WHERE true";
      if (options.id_commune) {
        optionsQuery += format(" AND id_commune =?", options.id_commune);
        delete options.id_commune;
      }
      if (options.id_daira) {
        optionsQuery += format(
          " AND id_commune = (SELECT id FROM commune WHERE id_daira = ?)",
          options.id_daira
        );
        delete options.id_daira;
      }
      if (options.id_wilaya) {
        optionsQuery += format(
          " AND id_commune IN (SELECT id FROM commune WHERE id_daira IN (SELECT id FROM daira WHERE id_wilaya = ?))",
          options.id_wilaya
        );
        delete options.id_wilaya;
      }
      if (Object.keys(options).length > 0)
        optionsQuery += formulateAndQuery(" AND ?", options);
    }
    statement +=
      optionsQuery +
      " ORDER BY name LIMIT ?,?;SELECT count(*) as size FROM hospital" +
      optionsQuery +
      ";";
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
const insertHospital = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO hospital SET ?";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("hospital.", "")
            )
          );
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
              "invalid_data",
              "The entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const updateHospital = (newValues, query) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE hospital SET ? WHERE ?";
    dbPool.query(statement, [newValues, query], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("hospital.", "")
            )
          );
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
              "invalid_data",
              "The entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteHospital = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM hospital WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectHospitals,
  insertHospital,
  updateHospital,
  deleteHospital,
};
