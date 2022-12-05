const { dbPool, format, errorHandler } = require("../../Database/Connection");

const selectReportById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM medical_report WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result[0]);
    });
  });
const selectReportList = (id_patient, options) =>
  new Promise((resolve, reject) => {
    let page = options?.page || 1;
    let limit = options?.limit || 10;
    let pagination = page * limit - limit;
    let statement = "SELECT * FROM medical_report WHERE id_patient=?";
    if (options.created_at)
      statement += format(" AND created_at=?", options.created_at);
    statement +=
      " ORDER BY created_at LIMIT ?,?;SELECT count(*) as size FROM medical_report WHERE id_patient=?;";
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
const insertReport = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO medical_report SET ?;";
    console.log(values);
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        console.log(dbErr);
        if (dbErr.errno == 1452)
          return reject(
            new errorHandler(
              "invalid_data",
              "the entered data might be incorrect"
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteReport = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM medical_report WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectReportById,
  selectReportList,
  insertReport,
  deleteReport,
};
