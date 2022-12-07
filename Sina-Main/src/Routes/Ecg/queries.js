const { dbPool, format, errorHandler } = require("../../Database/Connection");

const selectPatientEcgFiles = (id_patient, options) =>
  new Promise((resolve, reject) => {
    let page = options.page || 1;
    let limit = options.limit || 10;
    delete options?.page;
    delete options?.limit;
    let pagination = page * limit - limit;
    let statement = "SELECT id, created_at FROM ecg_file WHERE id_patient = ?";

    if (Object.keys(options).length > 0) {
      if (options.year)
        statement += format(" AND YEAR(created_at)=?", options.year);
      if (options.month)
        statement += format(" AND MONTH(created_at)=?", options.month);
      if (options.day)
        statement += format(" AND DAY(created_at)=?", options.day);
    }
    statement +=
      " ORDER BY created_at LIMIT ?,?;SELECT count(*) as size FROM ecg_file WHERE id_patient = ?;";
    dbPool.query(
      statement,
      [id_patient, pagination, limit, id_patient],
      (dbErr, result) => {
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
      }
    );
  });
const insertEcgFile = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO ecg_file SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
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
