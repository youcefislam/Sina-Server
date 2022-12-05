const {
  dbPool,
  errorHandler,
  formulateAndQuery,
} = require("../../Database/Connection");

const selectPatientDrugList = (id, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT d.id,d.name,d.company,d.description,d.adult_dosage,children_dosage,d.warnings FROM drug d,drugs_list dl WHERE d.id=dl.id_drug AND dl.id_patient=? ORDER BY d.name LIMIT ?,?; SELECT count(*) as size FROM drugs_list WHERE id_patient = ?;";
    dbPool.query(statement, [id, pagination, limit, id], (dbErr, result) => {
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
const selectAllDrugs = ({ page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT * FROM drug ORDER BY name limit ?,?;SELECT count(*) as size FROM drug;";
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
const insertDrug = (query) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO drug SET ?;";
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("drug.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const selectDrugById = (id) =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM drug WHERE id = ?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const updatedDrug = (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = "UPDATE drug SET ? WHERE ?;";
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("drug.", "")
            )
          );
        return reject(dbErr);
      }
      resolve(result);
    });
  });
const deleteDrug = (id) =>
  new Promise((resolve, reject) => {
    let statement = "DELETE FROM drug WHERE id=?;";
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertIntoDrugList = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO drugs_list SET ?;";
    dbPool.query(statement, values, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          return reject(
            new errorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("drugs_list.", "")
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
const deleteFromDrugList = (query) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery("DELETE FROM drugs_list WHERE ?;", query);

    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const selectDrugsJournal = (id, { page = 1, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const pagination = page * limit - limit;
    let statement =
      "SELECT * FROM drugs_journal WHERE id_patient=? ORDER BY date LIMIT ?,?;SELECT count(*) as size FROM drugs_journal WHERE id_patient = ?;";
    dbPool.query(statement, [id, pagination, limit, id], (dbErr, result) => {
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
const selectDrugsJournalItem = (query) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery(
      "SELECT * FROM drugs_journal WHERE ?;",
      query
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
const insertIntoDrugJournal = (values) =>
  new Promise((resolve, reject) => {
    let statement = "INSERT INTO drugs_journal SET ?;";
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
const deleteFromJournal = (query) =>
  new Promise((resolve, reject) => {
    let statement = formulateAndQuery(
      "DELETE FROM drugs_journal WHERE ?;",
      query
    );
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      resolve(result);
    });
  });
module.exports = {
  selectPatientDrugList,
  selectAllDrugs,
  insertDrug,
  selectDrugById,
  updatedDrug,
  deleteDrug,
  insertIntoDrugList,
  deleteFromDrugList,
  selectDrugsJournal,
  selectDrugsJournalItem,
  insertIntoDrugJournal,
  deleteFromJournal,
};
