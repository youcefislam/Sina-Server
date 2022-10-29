const dbPool = require("../../Database/Connection");
const fs = require("mz/fs");
const path = require("path");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const addEcgFile = async (req, res) => {
  const { error, value } = await validateBody("validDate", req.body);
  if (error) res.status(400).send(error.details);
  else {
    if (req?.file?.path) {
      let statement =
        "INSERT INTO fichierecg(lienFichier,dateCreation,idPatient) VALUES(?,?,?);";
      dbPool.query(
        statement,
        [req?.file?.path, value.date, req?.autData?.id],
        (dbErr, result) => {
          if (dbErr) res.status(500).send({ error: "internal_server_error" });
          else res.end();
        }
      );
    } else res.status(400).send({ error: "no_file_attached" });
  }
};

const getEcgFile = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "SELECT lienFichier FROM fichierecg WHERE idFichierECG=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.sendStatus(500);
      else
        result[0]
          ? res.download("./" + path.normalize(result[0].lienFichier))
          : res.send({ error: "file not found" });
    });
  }
};

module.exports = { addEcgFile, getEcgFile };
