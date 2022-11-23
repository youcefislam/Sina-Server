const {
  dbPool,
  format,
  formulateAndQuery,
  queryErrorHandler,
} = require("../../Database/Connection");

const selectHospitals = (options = null, page = 1) =>
  new Promise((resolve, reject) => {
    let pagination = page * 5 - 5;
    let statement = "SELECT * FROM hospital";
    delete options?.page;
    if (Object.keys(options).length > 0) {
      statement += " WHERE true";
      if (options.id_commune) {
        statement += format(" AND id_commune =?", options.id_commune);
        delete options.id_commune;
      }
      if (options.id_daira) {
        statement += format(
          " AND id_commune = (SELECT id FROM commune WHERE id_daira = ?)",
          options.id_daira
        );
        delete options.id_daira;
      }
      if (options.id_wilaya) {
        statement += format(
          " AND id_commune IN (SELECT id FROM commune WHERE id_daira IN (SELECT id FROM daira WHERE id_wilaya = ?))",
          options.id_wilaya
        );
        delete options.id_wilaya;
      }
      if (Object.keys(options).length > 0)
        statement += formulateAndQuery(" AND ?", options);
    }
    statement += " ORDER BY name LIMIT ?,5;";
    dbPool.query(statement, pagination, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertHospital = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO hospital SET ?";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("hospital.", "")
            )
          );
        if (dbErr.errno == 1452)
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
const updateHospital = (newValues, query) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE hospital SET ? WHERE ?";
    dbPool.query(statement, [newValues, query], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("hospital.", "")
            )
          );
        if (dbErr.errno == 1452)
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
