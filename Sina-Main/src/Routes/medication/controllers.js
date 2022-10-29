const fs = require("mz/fs");
const moment = require("moment");
const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const getMedicationOfPatient = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT m.idMedicament,m.nomMedicament,l.posologie,l.dateDebut FROM medicament m,listMedicament l WHERE m.idMedicament=l.idMedicament AND l.idPatient=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.send({ results: result });
    });
  }
};

const addMedicationToList = async (req, res) => {
  const { error, value } = await validateBody("validMedication", {
    ...req.params,
    ...req.body,
  });
  if (error) res.status(400).send(error.details);
  else {
    console.log(value);
    let statement =
      "insert into listmedicament(idMedicament,idPatient,posologie,dateDebut) VALUES (?,?,?,curdate());";
    dbPool.query(
      statement,
      [value.idMedicament, value.id, value.dosage],
      (dbErr, result) => {
        if (dbErr) {
          console.log(dbErr);
          res.status(500).send({ error: "internal_server_error" });
        } else res.end();
      }
    );
  }
};

const modifyMedicationOnList = async (req, res) => {
  const { error, value } = await validateBody("validMedication", {
    ...req.params,
    ...req.body,
  });
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE listmedicament SET posologie=? WHERE idPatient=? AND idMedicament=?;";
    dbPool.query(
      statement,
      [value.dosage, value.id, value.idMedicament],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const deleteMedicationFromList = async (req, res) => {
  const { error, value } = await validateBody("validMedicationId", {
    ...req.params,
    ...req.body,
  });
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "DELETE FROM listMedicament WHERE idPatient=? AND idMedicament=?;";
    dbPool.query(statement, [value.id, value.idMedicament], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const getAllMedication = async (req, res) => {
  let statement = "SELECT * FROM medicament;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const addNewMedication = async (req, res) => {
  const { error, value } = await validateBody("validMedicationName", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "INSERT INTO medicament(nomMedicament) values(?);";
    dbPool.query(statement, value.nomMedicament, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const modifyMedication = async (req, res) => {
  const { error, value } = await validateBody("validNameMedication", {
    ...req.params,
    ...req.body,
  });
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE medicament SET nomMedicament=? WHERE idMedicament=?;";
    dbPool.query(
      statement,
      [value.nomMedicament, value.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const deleteMedication = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "DELETE FROM medicament WHERE idMedicament=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const addMedicationToJournal = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT lienJournalMedicament,idPatient,dateInscriptionPatient FROM patient WHERE idPatient =?;";
    dbPool.query(statement, req.autData.id, async (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        const error = await fs.appendFile(
          result[0].lienJournalMedicament
            ? result[0].lienJournalMedicament
            : "./Public/uploads/MedicJournal/" +
                result[0].idPatient +
                "-" +
                result[0].dateInscriptionPatient.getTime() / 1000 +
                ".txt",
          `{idMedicament:${value.id},date:${moment().format()}},`
        );
        if (error) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    });
  }
};

const endMedicationJournal = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    console.log(req.autData.id);
    let statement =
      "DELETE FROM listmedicament WHERE idMedicament = ? AND idPatient = ?;";
    dbPool.query(statement, [value.id, req.autData.id], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

module.exports = {
  getMedicationOfPatient,
  addMedicationToList,
  modifyMedicationOnList,
  deleteMedicationFromList,
  getAllMedication,
  addNewMedication,
  modifyMedication,
  deleteMedication,
  addMedicationToJournal,
  endMedicationJournal,
};
