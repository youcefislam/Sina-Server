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

const patientSendRestoreLink = async (req, res) => {
  const { error, value } = await validateBody("validMail", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT idPatient,userNamePatient FROM patient WHERE mailPatient = ?;";
    dbPool.query(statement, value.email, async (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        if (result[0]) {
          const { token, error } = await generateToken(
            {
              id: result[0].idPatient,
              username: result[0].userNamePatient,
            },
            {
              expiresIn: "2h",
            }
          );
          if (error) res.status(500).send({ error: "internal_server_error" });
          else {
            const url = `http://localhost:3000/patient/restorepassword/${token}`;
            const emailBody = `
                                      <h3>Cher ${result[0].userNamePatient}!</h3>
                                      <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                                      <a href='${url}'>${url}</a>
                                      <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                                      <p>Cordialement,</p>
                                      <p>L'équipe de Sina.</p>`;
            const { error } = await sendMail(
              value.email,
              "Restaurer votre mot de passe ✔",
              emailBody
            );
            if (error) res.status(500).send({ error: "internal_server_error" });
            else res.end();
          }
        } else res.status(400).send({ error: "no_account_found" });
      }
    });
  }
};

const patientResetPassword = async (req, res) => {
  const { error, value } = await validateBody("validNewPassword", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(value.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement =
        "UPDATE patient SET passwordPatient = ? WHERE idPatient = ?;";
      dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      });
    }
  }
};

const patientSignIn = async (req, res) => {
  const { error, value } = await validateBody("patientSignIn", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT idPatient,passwordPatient FROM patient WHERE usernamePatient=?";
    dbPool.query(statement, value.username, async (err, result) => {
      if (err) res.status(500).send({ error: "internal_server_error" });
      else {
        if (result[0]) {
          const { correct, error } = await comparePassword(
            value.password,
            result[0].passwordPatient
          );
          if (error) res.status(500).send({ error: "internal_server_error" });
          else {
            if (correct) {
              const { token, error } = await generateToken({
                id: result[0].idPatient,
                username: value.username,
                patient: 1,
              });
              if (error)
                res.status(500).send({ error: "internal_server_error" });
              else res.send({ token });
            } else {
              res.status(400).send({ error: "wrong_password" });
            }
          }
        } else res.status(400).send({ error: "wrong_password" });
      }
    });
  }
};

const patientModifyMail = async (req, res) => {
  const { error, value } = await validateBody("validMail", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE patient SET mailPatient=? WHERE idPatient=?";
    dbPool.query(statement, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          res.status(400).send({
            error: 1062,
            message: dbErr.sqlMessage,
          });
        else res.status(500).send({ error: "internal_server_error" });
      } else res.end();
    });
  }
};

const patientModifyUsername = async (req, res) => {
  const { error, value } = await validateBody("validUsername", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE patient SET userNamePatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.username, req.autData.id],
      async (dbErr, result) => {
        if (dbErr) {
          if (dbErr.errno == 1062)
            res.status(400).send({
              error: 1062,
              message: dbErr.sqlMessage,
            });
          else res.status(500).send({ error: "internal_server_error" });
        } else {
          const { token, error } = await generateToken({
            id: req.autData.id,
            username: value.username,
          });
          if (error) res.status(500).send({ error: "internal_server_error" });
          else res.send({ token });
        }
      }
    );
  }
};

const patientModifyPassword = async (req, res) => {
  const { error, value } = await validateBody("validNewPassword", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(value.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement = "UPDATE patient SET passwordPatient=? WHERE idPatient=?";
      dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      });
    }
  }
};

const patientModifyName = async (req, res) => {
  const { error, value } = await validateBody("validName", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE patient SET nomPatient=?,prenomPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.nom, value.prenom, req.autData.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const patientModifyNumber = async (req, res) => {
  const { error, value } = await validateBody("validNumber", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE patient SET NumTlfPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.numeroTlf, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          if (dbErr.errno == 1062)
            res.status(400).send({
              error: 1062,
              message: dbErr.sqlMessage,
            });
          else res.status(500).send({ error: "internal_server_error" });
        } else res.end();
      }
    );
  }
};

const patientModifyAddress = async (req, res) => {
  const { error, value } = await validateBody("validPatientAddress", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE patient SET idCommune=(SELECT idCommune FROM commune WHERE idCommune=?),adressPatient=? WHERE idPatient=?;";
    dbPool.query(
      statement,
      [value.commune, value.adress, req.autData.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const getPatientInfo = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT idPatient,nomPatient,prenomPatient,sexePatient,dateNaisPatient,adressPatient,photoPatient,degreGravite,statusPatient,TypeMaladie,mailPatient,nomProche,prenomProche,NumTlfProche,mailProche,nomCommune,nomDaira,nomWilaya FROM patient p,typemaladie t,proche r,commune c,daira d, wilaya w WHERE p.idPatient=? and p.idProche=r.idProche and p.idTypeMaladie=t.idTypeMaladie and c.idDaira=d.idDaira and d.idWilaya=w.idWilaya LIMIT 1;SELECT idFichierECG,lienFichier,dateCreation FROM fichierecg WHERE idPatient=?;SELECT idRapport,dateRapport FROM rapport WHERE idPatient=?; SELECT idRendezVous,dateRV FROM  rendezvous WHERE idPatient=?;";
    dbPool.query(
      statement,
      [
        req.params.id,
        req.params.id,
        req.params.id,
        req.params.id,
        req.params.id,
      ],
      (dbErr, results, fields) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.send({ results });
      }
    );
  }
};

const getMyInfoPatient = (req, res) => {
  let statement =
    "SELECT p.nomPatient,p.idMedecin,p.idProche,p.userNamePatient,p.mailPatient,p.prenomPatient,p.sexePatient,p.dateNaisPatient,p.adressPatient,p.degreGravite,p.dateInscriptionPatient,p.NumTlfPatient,nomWilaya,nomCommune,nomDaira,p.idProche,NumTlfProche FROM patient p,wilaya w,commune c,daira d,proche pr WHERE p.idPatient=? and p.idProche=pr.idProche and c.idCommune=p.idCommune and c.idDaira=d.idDaira and d.idWilaya=w.idWilaya;SELECT NumTlfMedecin,TypeMaladie from patient p,typemaladie t,medecin m where p.idMedecin=m.idMedecin and t.idTypeMaladie=p.idTypeMaladie and p.idPatient = ?;";

  dbPool.query(statement, [req.autData.id, req.autData.id], (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else {
      let temp = {
        ...result[0][0],
        ...result[0][1],
      };
      res.send({ results: result[0] });
    }
  });
};

module.exports = {
  patientSignUp,
  patientResendValidation,
  patientAddInfo,
  patientDeleteAccount,
  patientSendRestoreLink,
  patientResetPassword,
  patientSignIn,
  patientModifyMail,
  patientModifyUsername,
  patientModifyPassword,
  patientModifyName,
  patientModifyNumber,
  patientModifyAddress,
  getPatientInfo,
  getMyInfoPatient,
};
