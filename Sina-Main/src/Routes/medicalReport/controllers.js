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

const addMedicalReport = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    if (req?.file?.path) {
      let statement =
        "INSERT INTO rapport(lienRapport,dateRapport,idPatient) VALUES(?,curdate(),?);";
      dbPool.query(statement, [req.file.path, value.id], (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      });
    } else res.status(400).send({ error: "no_file_attached" });
  }
};

const getMedicalReport = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "SELECT lienRapport FROM rapport WHERE idRapport=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        if (result[0]) {
          try {
            const fileName = "file.pdf";
            const fileURL = "./" + path.normalize(result[0].lienRapport);
            const stream = fs.createReadStream(fileURL);
            res.set({
              "Content-Disposition": `attachment; filename='${fileName}'`,
              "Content-Type": "application/pdf",
            });
            stream.pipe(res);
          } catch (e) {
            console.log(e);
            res.status(500).send({ error: "internal_server_error" });
          }
        } else res.send(400).send({ error: "file_not_found" });
      }
    });
  }
};

module.exports = { addMedicalReport, getMedicalReport };
