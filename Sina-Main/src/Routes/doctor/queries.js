const {
  dbPool,
  formulateAndQuery,
  errorHandler,
} = require("../../database/connection");

const selectDoctor_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctor WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });

const selectAllDoctor = ({ page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT * FROM doctorView ORDER BY first_name, last_name LIMIT ?,?;SELECT count(*) as size FROM doctorView;";
    dbPool.query(statement, { pagination, limit }, (dbErr, result) => {
      if (dbErr) reject(dbErr);
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

const deleteDoctor = (id_doctor) =>
  new Promise((resolve, reject) => {
    const statement = `DELETE FROM doctor WHERE id=?;`;
    dbPool.query(statement, id_doctor, (dbErr, result) => {
      if (dbErr) reject();
      else resolve();
    });
  });

const updateDoctor = (newValue, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE doctor SET ? WHERE ?;`;
    dbPool.query(statement, [newValue, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
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
      return resolve(result);
    });
  });

const selectPatientList = (id_doctor, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    const statement = `SELECT * FROM patientViewDetailed WHERE id_doctor=? ORDER BY first_name, last_name LIMIT ?,?;SELECT count(*) as size FROM patientViewDetailed WHERE id_doctor=?;`;
    dbPool.query(
      statement,
      [id_doctor, pagination, limit, id_doctor],
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

const searchDoctor = (query) =>
  new Promise((resolve, reject) => {
    let page = query.page || 1;
    let limit = query.limit || 10;
    let pagination = page * limit - limit;
    delete query.page;
    delete query.limit;
    let statement = formulateAndQuery(
      `SELECT count(*) as size FROM doctorView WHERE ?; SELECT * FROM doctorView WHERE ?`,
      [query, query]
    );
    statement += " ORDER BY first_name,last_name LIMIT ?,?;";
    dbPool.query(statement, [pagination, limit], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      const maxPage = Math.ceil(result[0][0].size / limit);
      resolve({
        Results: result[1],
        Pagination: {
          page,
          nextPage: page < maxPage ? ++page : -1,
          limit,
          maxPage,
        },
      });
    });
  });

module.exports = {
  selectDoctor_sensitive,
  selectAllDoctor,
  deleteDoctor,
  updateDoctor,
  selectPatientList,
  searchDoctor,
};
