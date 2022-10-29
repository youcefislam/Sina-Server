const fs = require("mz/fs");
const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const addAppointment = async (req, res) => {
  const { error, value } = await validateBody("validAppointment", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "INSERT INTO rendezvous(idPatient,dateRV) VALUES(?,?);";
    dbPool.query(statement, [value.id, value.date], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const updateAppointment = async (req, res) => {
  const { error, value } = await validateBody("validAppointment", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE rendezvous SET dateRV=? WHERE idRendezVous=?;";
    dbPool.query(statement, [value.date, value.id], (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const cancelAppointment = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "DELETE FROM  rendezvous WHERE idRendezVous=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

const archiveAppointment = async (req, res) => {
  const { error, value } = await validateBody("validAppointment", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT lienHistoriqueRV,idPatient,dateInscriptionPatient FROM patient WHERE idPatient = (SELECT idPatient FROM rendezvous WHERE idRendezVous=?);";
    dbPool.query(statement, value.id, async (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        const error = await fs.appendFile(
          result[0].lienHistoriqueRV
            ? result[0].lienHistoriqueRV
            : "./Public/uploads/ECGFiles/" +
                result[0].idPatient +
                "-" +
                result[0].dateInscriptionPatient.getTime() / 1000 +
                ".txt",
          `${value.date}\n`
        );
        if (error) res.status(500).send({ error: "internal_server_error" });
        else {
          statement = "DELETE FROM rendezvous WHERE idRendezVous=?;";
          dbPool.query(statement, value.id, (dbErr, result2) => {
            if (dbErr) res.status(500).send({ error: "internal_server_error" });
            else res.end();
          });
        }
      }
    });
  }
};

module.exports = {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  archiveAppointment,
};
