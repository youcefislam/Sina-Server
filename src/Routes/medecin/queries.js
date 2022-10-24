const mysql = require("mysql");
const moment = require("moment");
const dbPool = require("../../Database/connection");

function queryErrorHandler(type, message, path) {
  this.type = type;
  this.message = message;
  this.path = path;
}

const insertMedecin = (info) =>
  new Promise((resolve, reject) => {
    info.created_at = moment().format();
    delete info.repeat_password;

    let statement = `INSERT INTO doctor SET ?;`;

    dbPool.query(statement, info, (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        else reject(dbErr);
      } else resolve(result.insertId);
    });
  });

const insertNotVerifiedMedecin = async (idMedecin) =>
  new Promise((resolve, reject) => {
    statement = "INSERT INTO doctor_account_validation VALUES(?);";
    dbPool.query(statement, idMedecin, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result.insertId);
    });
  });

const selectMedecinByUsername = (usernameMedecin) =>
  new Promise(async (resolve, reject) => {
    try {
      return await medecin.findOne({
        where: {
          usernameMedecin,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  });

const selectMedecinById = async (idMedecin) =>
  new Promise((resolve, reject) => {
    // const statement = `SELECT * FROM doctorView`
    // dbPool.query
    // try {
    //   return await medecin.findOne({
    //     where: {
    //       idMedecin,
    //     },
    //     include: {
    //       model: daira,
    //       as: "daira",
    //       include: {
    //         model: wilaya,
    //         as: "wilaya",
    //       },
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    //   throw new Error(error);
    // }
  });

const selectDoctor_sensitive = (query) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctor WHERE ?;`;
    dbPool.query(statement, query, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });

const selectMedecinByMail = (mail) =>
  new Promise((resolve, reject) => {
    let statement = `SELECT * FROM doctorView where mail=?;`;
    dbPool.query(statement, mail, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result[0]);
    });
  });

const selectAllMedecin = () =>
  new Promise((resolve, reject) => {
    let statement = "SELECT * FROM doctorView;";
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

const deleteMedecinAccount = (idMedecin) =>
  new Promise((resolve, reject) => {
    const statement = `DELETE FROM doctor WHERE id=?;`;
    dbPool.query(statement, idMedecin, (dbErr, result) => {
      if (dbErr) reject();
      else resolve();
    });
  });

const updateMedecin = (newValue, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE doctor SET ? WHERE ?;`;
    dbPool.query(statement, [newValue, options], (dbErr, result) => {
      if (dbErr) {
        console.log(dbErr);
        if (dbErr.errno == 1062)
          reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        else if (dbErr.errno == 1452)
          reject(
            new queryErrorHandler(
              "invalid_data",
              `no data found with the entered data`
            )
          );
        else reject(dbErr);
      } else resolve(result);
    });
  });

const selectMedecinsPatientList = (id) =>
  new Promise((resolve, reject) => {
    const statement = `SELECT * FROM patientView WHERE id_doctor=?;`;
    dbPool.query(statement, id, (dbErr, results) => {
      if (dbErr) reject(dbErr);
      else resolve(results);
    });
  });

const selectMedecinByPatientId = async (idPatient) => {
  try {
    const { idMedecin } = await patient.findOne({
      attributes: ["idMedecin"],
      where: {
        idPatient,
      },
    });
    return idMedecin;
  } catch (error) {
    throw new Error(error);
  }
};

const validateAccount = (id) =>
  new Promise((resolve, reject) => {
    let statement = `DELETE FROM doctor_account_validation WHERE id=?;`;
    dbPool.query(statement, id, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

const searchDoctor = (query) =>
  new Promise((resolve, reject) => {
    let statement = mysql
      .format(`SELECT * FROM doctorView WHERE ?;`, query)
      .replace(",", ` AND`);
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

module.exports = {
  insertMedecin,
  insertNotVerifiedMedecin,
  selectMedecinById,
  selectMedecinByUsername,
  selectAllMedecin,
  deleteMedecinAccount,
  updateMedecin,
  selectMedecinsPatientList,
  selectMedecinByPatientId,
  selectMedecinByMail,
  selectDoctor_sensitive,
  validateAccount,
  searchDoctor,
};
