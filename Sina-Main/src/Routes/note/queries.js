const { dbPool, errorHandler } = require("../../database/connection");

const insertNote = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO medical_note SET ?;";
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

const selectNoteById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM medical_note WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const updateNote = (newValues, query) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE medical_note SET ? WHERE ?;";
    dbPool.query(statement, [newValues, query], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const selectNoteList = (id_patient, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    let pagination = page * limit - limit;
    let statement =
      "SELECT * FROM medical_note WHERE id_patient=? ORDER BY updated_at,created_at DESC LIMIT ?,?; SELECT count(*) as size FROM medical_note WHERE id_patient=?;";
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
const deleteNote = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM medical_note WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  insertNote,
  selectNoteById,
  updateNote,
  selectNoteList,
  deleteNote,
};
