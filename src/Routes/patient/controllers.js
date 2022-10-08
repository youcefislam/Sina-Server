const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
  createValidationCode,
} = require("../../Utilities/utility");

const patientSignUp = async (req, res) => {
  const { error, value } = await validateBody("patientSignUp", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(req.body.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement =
        "INSERT INTO patient(userNamePatient,passwordPatient,mailPatient,dateInscriptionPatient) VALUES(?,?,?,CURDATE());";
      dbPool.query(
        statement,
        [value.username, hash, value.email],
        (dbErr, result1) => {
          if (dbErr) {
            console.log("##db error##", dbErr);
            if (dbErr.errno == 1062)
              res.status(400).send({
                error: 1062,
                message: dbErr.sqlMessage,
              });
            else res.status(500).send({ error: "internal_server_error" });
          } else {
            statement = "INSERT INTO patientNonVerifie values (?,?);";
            const validationCode = createValidationCode();
            dbPool.query(
              statement,
              [result1.insertId, validationCode],
              async (dbErr, result2) => {
                if (dbErr) {
                  console.log("##db error##", dbErr);
                  res.status(500).send({ error: "internal_server_error" });
                } else {
                  const emailBody = `
                          <h3>Cher ${value.username}!</h3>
                          <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
                          <p style="font-weight: bold;color: #0DBDA5;">${validationCode}</p>
                          <p>Cordialement,</p>
                          <p>L'équipe de Sina.</p>`;
                  const { error } = await sendMail(
                    value.email,
                    "Vérifiez votre adresse e-mail ✔",
                    emailBody
                  );
                  if (error)
                    res.status(500).send({ error: "internal_server_error" });
                  else {
                    const { token, error } = await generateToken({
                      id: result1.insertId,
                      username: value.username,
                      patient: 1,
                    });
                    if (error)
                      res.status(500).send({ error: "internal_server_error" });
                    else res.send({ validationCode, token });
                  }
                }
              }
            );
          }
        }
      );
    }
  }
};

const patientResendValidation = async (req, res) => {
  let statement = "SELECT idPatient FROM patientNonVerifie WHERE idPatient=?;";
  dbPool.query(statement, req.autData.id, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else {
      if (result[0]?.idPatient == req.autData.id) {
        statement = "SELECT mailPatient FROM patient WHERE idPatient=?;";
        dbPool.query(statement, result[0]?.idPatient, (dbErr, result2) => {
          if (dbErr) res.status(500).send({ error: "internal_server_error" });
          else {
            const validationCode = createValidationCode();
            statement =
              "UPDATE patientNonVerifie SET validationCode=? WHERE idPatient=?;";
            dbPool.query(
              statement,
              [validationCode, req.autData.id],
              async (dbErr, result3) => {
                if (dbErr)
                  res.status(500).send({ error: "internal_server_error" });
                else {
                  const emailBody = `
                      <h3>Cher ${req.autData.username}!</h3>
                      <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
                      <p style="font-weight: bold;color: #0DBDA5;">${validationCode}</p>
                      <p>Cordialement,</p>
                      <p>L'équipe de Sina.</p>`;
                  const { error } = await sendMail(
                    result2[0].mailPatient,
                    "Vérifiez votre adresse e-mail ✔",
                    emailBody
                  );
                  if (error)
                    res.status(500).send({ error: "internal_server_error" });
                  else res.send({ validationCode });
                }
              }
            );
          }
        });
      } else res.status(403);
    }
  });
};

const patientAddInfo = async (req, res) => {
  const { error, value } = await validateBody("patientInfo", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE patient SET nomPatient=?,prenomPatient=?,NumTlfPatient=?,sexePatient=?,dateNaisPatient=?,adressPatient=?,idCommune=(SELECT idCommune FROM commune WHERE idCommune=?) WHERE idPatient=?;";
    dbPool.query(
      statement,
      [
        value.nom,
        value.prenom,
        value.num,
        value.sex,
        new Date(value.dateNaiss),
        value.adress,
        value.idCommune,
        req.autData.id,
      ],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const patientDeleteAccount = async (req, res) => {
  let statement = "DELETE FROM patient WHERE idPatient=?;";
  dbPool.query(statement, req.autData.id, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.end();
  });
};

module.exports = {
  patientSignUp,
  patientResendValidation,
  patientAddInfo,
  patientDeleteAccount,
};
