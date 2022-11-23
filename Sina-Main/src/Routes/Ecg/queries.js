const {
  dbPool,
  format,
  queryErrorHandler,
} = require("../../Database/Connection");

const selectPatientEcgFiles = (id_patient, options, page = 1) =>
  new Promise((resolve, reject) => {
    let pagination = page * 5 - 5;
    let statement = "SELECT * FROM ecg_file WHERE id_patient = ?";
    delete options?.page;

    if (Object.keys(options).length > 0) {
      statement += format(
        " AND YEAR(created_at)=? AND MONTH(created_at)=? AND DAY(created_at)=?",
        [options.year, options.month, options.day]
      );
    }
    statement += " ORDER BY created_at LIMIT ?,5;";
    dbPool.query(statement, [id_patient, pagination], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertEcgFile = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO ecg_file SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
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
const selectEcgFileById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT link FROM ecg_file WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
module.exports = {
  selectPatientEcgFiles,
  insertEcgFile,
  selectEcgFileById,
};
