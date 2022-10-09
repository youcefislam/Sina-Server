const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const medecinSignUp = async (req, res) => {
  // Check the data form and verify it

  const { error, value } = await validateBody("medecinSignUp", req.body);

  if (error) {
    res.status(403).send(error.details);
  } else {
    const { hash, error } = await hashPassword(value.password);

    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement = `INSERT INTO medecin(userNameMedecin,passwordMedecin,mailMedecin,nomMedecin,prenomMedecin,sexeMedecin,photoMedecin,dateInscriptientMedecin,NumTlfMedecin,idDaira)
          VALUES(?,?,?,?,?,?,?,curdate(),?,?);`;
      value.numeroTlf =
        value.numeroTlf[0] == "0" ? value.numeroTlf.slice(1) : value.numeroTlf;
      dbPool.query(
        statement,
        [
          value.username,
          hash,
          value.email,
          value.nom,
          value.prenom,
          value.sex,
          req.file ? req.file.path : null,
          value.numeroTlf,
          value.daira,
        ],
        (dbErr, result) => {
          // If any database error occure
          if (dbErr) {
            console.log("##db error##", dbErr);
            // if we have double entry error
            if (dbErr.errno == 1062)
              res.status(403).send({
                error: 1062,
                message: dbErr.sqlMessage,
              });
            else res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
          } else {
            // Everything is good we move on
            // we add the doctor to the not verified accounts table
            statement = "INSERT INTO medecinNonVerifie VALUES(?);";
            dbPool.query(
              statement,
              result.insertId,
              async (dbEerr, result2) => {
                if (dbEerr) {
                  // database error
                  console.log("## db error ## ", dbErr);
                  res.status(500).send({ error: "internal_server_error" });
                } else {
                  // Create a token for the user
                  const { token, error } = await generateToken({
                    id: result.insertId,
                    username: value.username,
                  });
                  if (error)
                    res.status(500).send({ error: "internal_server_error" });
                  else {
                    const url = `http://localhost:3000/confirmation/${token}`;
                    const emailBody = `
                                <h3>Cher ${value.username}!</h3>
                                <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                                <a href='${url}'>${url}</a>
                                <p>Cordialement,</p>
                                <p>L'équipe de Sina.</p>`;
                    // We send a confirmation mail to the user here
                    const mail = {
                      to: value.email, // Change to your recipient
                      from: "sina.app.pfe@outlook.fr", // Change to your verified sender
                      subject: "Vérifiez votre adresse e-mail ✔",
                      text: "Sina support team",
                      html: emailBody,
                    };
                    const { error } = await sendMail(mail);
                    if (error)
                      res.status(500).send({ error: "internal_server_error" });
                    else res.send({ token });
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

const medecinSignIn = async (req, res) => {
  // we validate the form of data we receive
  const { error, value } = await validateBody("medecinSignIn", req.body);
  if (error) {
    // data not valid
    console.log(error);
    res.status(403).send(error.details);
  } else {
    // valid data .. next
    // select the user information from the database and compare it to the received data
    let statement =
      "SELECT idMedecin,passwordMedecin FROM medecin WHERE usernameMedecin=?";
    dbPool.query(statement, value.username, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "internal_server_error" });
      } else {
        if (result[0]) {
          // Account exist
          const { error, correct } = await comparePassword(
            value.password,
            result[0].passwordMedecin
          );
          if (error) res.status(500).send({ error: "internal_server_error" });
          else {
            if (correct) {
              const { token, error } = await generateToken({
                id: result[0].idMedecin,
                username: value.username,
              });
              if (error)
                res.status(500).send({ error: "internal_server_error" });
              else res.send({ token });
            } else {
              res.status(403).send({ error: "password" });
            }
          }
        } else res.status(403).send({ error: "username" });
      }
    });
  }
};

const medecinValidateAccount = async (req, res) => {
  const { error, valid } = await validateToken(req.params.token);
  if (error) res.status(403).send({ error: "invalid_token" });
  else res.sendStatus(200);
};

const medecinDeleteAccount = (req, res) => {
  let statement = "DELETE FROM medecin WHERE idMedecin=?";
  dbPool.query(statement, req.autData.id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "internal_server_error" });
    } else res.end();
  });
};

const medecinModifyMail = async (req, res) => {
  const { error, value } = await validateBody("validMail", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE medecin SET mailMedecin=? WHERE idMedecin=?";
    dbPool.query(statement, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
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

const medecinModifyUsername = async (req, res) => {
  const { error, value } = await validateBody("validUsername", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE medecin SET userNameMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [value.username, req.autData.id],
      async (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send({
              error: 1062,
              message: dbErr.sqlMessage,
            });
          else res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
        } else {
          const { error, token } = await generateToken({
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

const medecinModifyPassword = async (req, res) => {
  const { error, value } = await validateBody("validNewPassword", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(value.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement = "UPDATE medecin SET passwordMedecin=? WHERE idMedecin=?";
      dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.status(500).send({ error: "internal_server_error" });
        } else res.end();
      });
    }
  }
};

const medecinModifyName = async (req, res) => {
  const { error, value } = await validateBody("validName", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE medecin SET nomMedecin=?,prenomMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [value.nom, value.prenom, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.status(500).send({ error: "internal_server_error" });
        } else res.end();
      }
    );
  }
};

const medecinModifyNumber = async (req, res) => {
  const { error, value } = await validateBody("validNumber", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE medecin SET NumTlfMedecin=? WHERE idMedecin=?";
    value.numeroTlf =
      value.numeroTlf[0] == "0" ? value.numeroTlf.slice(1) : value.numeroTlf;
    dbPool.query(
      statement,
      [value.numeroTlf, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send({
              error: 1062,
              message: dbErr.sqlMessage,
            });
          else res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
        } else res.end();
      }
    );
  }
};

const medecinModifyAutoAccept = async (req, res) => {
  const { error, value } = await validateBody("validAccept", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "UPDATE medecin SET autoAccept=? WHERE idMedecin=?";
    dbPool.query(statement, [value.auto, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
      } else res.end();
    });
  }
};

const medecinModifyDaira = async (req, res) => {
  const { error, value } = await validateBody("validDaira", req.body);
  if (error) res.send(error.details);
  else {
    // must be modified to check if the daira exists first after inserting it. -- NOT DONE YET
    let statement =
      "UPDATE medecin SET idDaira=(SELECT idDaira FROM daira WHERE idDaira=?) WHERE idMedecin=?;";
    dbPool.query(statement, [value.daira, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        res.status(500).send({ error: "internal_server_error" });
      } else res.end();
    });
  }
};

const medecinGetPatientList = async (req, res) => {
  const statement =
    "SELECT idPatient,nomPatient,prenomPatient,statusPatient,photoPatient,TIMESTAMPDIFF(year,dateNaisPatient,CURDATE()) as agePatient FROM patient WHERE idMedecin=?;";
  dbPool.query(statement, req.autData.id, (dberr, result) => {
    if (dberr) {
      console.log("## db err ## ", dberr);
      res.status(500).send({ error: "internal_server_error" });
    } else res.send({ results: result });
  });
};

const medecinRemovePatient = async (req, res) => {
  const { error, value } = validateBody("validPatientId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "SELECT idMedecin FROM patient WHERE idPatient=?;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        console.log("## db err ##", dberr);
        res.status(500).send({ error: "internal_server_error" });
      } else {
        if (result[0]?.idMedecin == req.autData.id) {
          statement = "UPDATE patient SET idMedecin=? WHERE idPatient=?";
          dbPool.query(statement, [null, value.idPatient], (dberr, result) => {
            if (dberr) {
              console.log("## db err ##", dberr);
              res.status(500).send({ error: "internal_server_error" });
            } else res.end();
          });
        } else res.status(400).send({ error: "patient_not_found" });
      }
    });
  }
};

const getListOfDoctors = (req, res) => {
  let statement =
    "SELECT idMedecin,nomMedecin,prenomMedecin,nomDaira,photoMedecin,nomWilaya FROM medecin m,wilaya w,daira d WHERE d.idWilaya=w.idWilaya AND d.idDaira=m.idDaira;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const medecinSendRestoreLink = async (req, res) => {
  const { error, value } = await validateBody("validMail", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "SELECT idMedecin,userNameMedecin FROM medecin WHERE mailMedecin = ?;";
    dbPool.query(statement, value.email, async (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        if (result[0]) {
          const { token, error } = await generateToken(
            { id: result[0].idMedecin, username: result[0].userNameMedecin },
            {
              expiresIn: "2h",
            }
          );
          if (error) res.status(500).send({ error: "internal_server_error" });
          else {
            const url = `http://localhost:3000/medecin/restorepassword/${token}`;
            const emailBody = `
                                  <h3>Cher ${result[0].userNameMedecin}!</h3>
                                  <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                                  <a href='${url}'>${url}</a>
                                  <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                                  <p>Cordialement,</p>
                                  <p>L'équipe de Sina.</p>`;
            const msg = {
              to: value.email, // Change to your recipient
              from: "sina.app.pfe@outlook.fr", // Change to your verified sender
              subject: "Restaurer votre mot de passe ✔",
              text: "Sina support team",
              html: emailBody,
            };
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

const medecinResetPassword = async (req, res) => {
  const { error, value } = await validateBody("validNewPassword", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(value.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement =
        "UPDATE medecin SET passwordMedecin = ? WHERE idMedecin = ?;";
      dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
        if (dbErr) res.sendStatus(500);
        else res.end();
      });
    }
  }
};

module.exports = {
  medecinSignUp,
  medecinSignIn,
  medecinValidateAccount,
  medecinDeleteAccount,
  medecinModifyMail,
  medecinModifyUsername,
  medecinModifyPassword,
  medecinModifyName,
  medecinModifyNumber,
  medecinModifyAutoAccept,
  medecinModifyDaira,
  medecinGetPatientList,
  medecinRemovePatient,
  getListOfDoctors,
  medecinSendRestoreLink,
  medecinResetPassword,
};
