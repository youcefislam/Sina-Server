const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const getAllNotesOfPatient = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT idNote,DateNote,NoteMedecin FROM notemedecin WHERE idPatient=?;";
    dbPool.query(
      statement,
      value.id ? value.id : req.autData.id,
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.send({ results: result });
      }
    );
  }
};

const addNoteToPatient = async (req, res) => {
  const { error, value } = await validateBody("validNote", {
    ...req.params,
    ...req.body,
  });
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "insert into notemedecin(datenote,notemedecin,idPatient) values(curdate(),?,?);";
    dbPool.query(statement, [value.note, value.id], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const modifyNotePatient = async (req, res) => {
  const { error, value } = await validateBody("validNote", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE notemedecin SET datenote=curdate(),notemedecin=? WHERE idNote=?;";
    dbPool.query(statement, [value.note, value.id], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const deleteNotePatient = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "DELETE FROM notemedecin WHERE idNote=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

module.exports = {
  getAllNotesOfPatient,
  addNoteToPatient,
  modifyNotePatient,
  deleteNotePatient,
};
