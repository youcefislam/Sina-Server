const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const modifyRelativeMail = async (req, res) => {
  const { error, value } = await validateBody("relativeMail", req.body);
  if (error) res.status(403).send(error.details);
  else {
    let statement =
      "UPDATE proche SET mailProche = ? WHERE idProche=(SELECT idProche FROM patient WHERE idPatient=?);";
    dbPool.query(statement, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        // if we have double entry error
        if (dbErr.errno == 1062)
          res.status(403).send({
            error: 1062,
            message: dbErr.sqlMessage,
          });
        else res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
      } else res.end();
    });
  }
};

const modifyRelativeNumber = async (req, res) => {
  const { error, value } = await validateBody("validNumber", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE proche SET NumTlfProche = ? WHERE idProche=(SELECT idProche FROM patient WHERE idPatient=?);";
    dbPool.query(sql, [value.number, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("## db error ## ", dbErr);
        if (dbErr.errno == 1062)
          res.status(400).send({
            error: 1062,
            message: dbErr.sqlMessage,
          });
        else res.status(500).send("internal_server_error"); // Internal server ERROR
      } else res.end();
    });
  }
};

module.exports = {
  modifyRelativeMail,
  modifyRelativeNumber,
};
