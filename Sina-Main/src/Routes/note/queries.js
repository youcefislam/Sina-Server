const { dbPool, queryErrorHandler } = require("../../Database/Connection");

const insertNote = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO medical_note SET ?;";
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
const selectNoteList = (id_patient, page = 1) =>
  new Promise((resolve, reject) => {
    let pagination = page * 5 - 5;
    let statement = "SELECT * FROM medical_note WHERE id_patient=? LIMIT ?,5;";
    dbPool.query(statement, [id_patient, pagination], (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
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
