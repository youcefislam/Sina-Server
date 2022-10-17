const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const {
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
} = require("./queries.js");

const { updatePatient } = require("../patient/queries.js");

const medecinSignUp = async (req, res) => {
  let medecin;

  try {
    const body = await validateBody("medecinSignUp", req.body);
    const hash = await hashPassword(body.password);
    medecin = await insertMedecin(
      body.username,
      hash,
      body.email,
      body.nom,
      body.prenom,
      body.sex,
      req.file ? req.file.path : null,
      body.numeroTlf,
      body.daira
    );
    const notVerifiedMedecin = await insertNotVerifiedMedecin(medecin);
    const token = await generateToken({
      id: medecin.idMedecin,
      username: medecin.userNameMedecin,
    });
    const url = `http://localhost:3000/confirmation/${token}`;
    const emailBody = `
              <h3>Cher ${medecin.userNameMedecin}!</h3>
              <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
              <a href='${url}'>${url}</a>
              <p>Cordialement,</p>
              <p>L'équipe de Sina.</p>`;
    await sendMail(
      medecin.mailMedecin,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );
    res.status(201).send({ token });
  } catch (error) {
    medecin?.destroy();
    if (
      error.type == "duplicated_entry_error" ||
      error.type == "validation_error"
    )
      res.status(400).send(error);
    else res.status(500);
  }
};

const medecinSignIn = async (req, res) => {
  try {
    const body = await validateBody("medecinSignIn", req.body);
    const medecinExist = await selectMedecinByUsername(body.username);
    if (medecinExist) {
      const correctPassword = await comparePassword(
        body.password,
        medecinExist.passwordMedecin
      );
      if (correctPassword) {
        const token = await generateToken({
          id: medecinExist.idMedecin,
          username: body.username,
        });
        res.status(201).send({ token });
      } else
        res
          .status(400)
          .send({ type: "incorrect_information", path: "password" });
    } else
      res.status(400).send({ type: "incorrect_information", path: "username" });
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinValidateAccount = async (req, res) => {
  try {
    await validateToken(req.params.token);
    res.end();
  } catch (error) {
    res.status(403);
  }
};

const medecinDeleteAccount = async (req, res) => {
  try {
    await deleteMedecinAccount(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyMail = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);
    await updateMedecin(
      { mailMedecin: value.email },
      { idMedecin: req.params.id }
    );
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyUsername = async (req, res) => {
  try {
    const value = await validateBody("validUsername", req.body);
    await updateMedecin(
      { userNameMedecin: value.username },
      { idMedecin: req.params.id }
    );
    const token = await generateToken({
      id: req.autData.id,
      username: value.username,
    });
    res.send({ token });
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyPassword = async (req, res) => {
  try {
    const value = await validateBody("validNewPassword", req.body);
    const hash = await hashPassword(value.password);

    await updateMedecin(
      { passwordMedecin: hash },
      { idMedecin: req.params.id }
    );
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyName = async (req, res) => {
  try {
    const value = await validateBody("validName", req.body);
    await updateMedecin(
      {
        nomMedecin: value.nom,
        prenomMedecin: value.prenom,
      },
      {
        idMedecin: req.params.id,
      }
    );
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyNumber = async (req, res) => {
  try {
    const value = await validateBody("validNumber", req.body);
    await updateMedecin(
      {
        NumTlfMedecin:
          value.numeroTlf[0] == "0"
            ? value.numeroTlf.slice(1)
            : value.numeroTlf,
      },
      {
        idMedecin: req.params.id,
      }
    );
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyAutoAccept = async (req, res) => {
  try {
    const value = await validateBody("validAccept", req.body);
    await updateMedecin(
      {
        autoAccept: value.auto,
      },
      {
        idMedecin: req.params.id,
      }
    );
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinModifyDaira = async (req, res) => {
  try {
    const value = await validateBody("validDaira", req.body);

    await updateMedecin(
      {
        idDaira: value.daira,
      },
      {
        idMedecin: req.params.id,
      }
    );
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinGetPatientList = async (req, res) => {
  try {
    const patientList = await selectMedecinsPatientList(req.params.id);
    res.send({ results: patientList });
  } catch (error) {
    res.status(500);
  }
};

const medecinRemovePatient = async (req, res) => {
  try {
    const idMedecin = await selectMedecinByPatientId(req.params.idPatient);

    if (idMedecin == req.params.idMedecin) {
      await updatePatient({ idMedecin: null }, { idPatient: req.params.id });
      res.sendStatus(204);
    } else res.status(400).send({ type: "patient_not_found" });
  } catch (error) {
    if (error.type == "invalid_data") res.status(400).send(error);
    else res.status(500);
  }
};

const getListOfDoctors = async (req, res) => {
  try {
    res.send({ results: await selectAllMedecin() });
  } catch (error) {
    res.status(500);
  }
};

const medecinSendRestoreLink = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);

    const medecin = await selectMedecinByMail(value.email);

    if (medecin?.idMedecin) {
      const { idMedecin, userNameMedecin } = medecin;
      const token = await generateToken(
        { id: idMedecin, username: userNameMedecin },
        {
          expiresIn: "2h",
        }
      );
      const url = `http://localhost:3000/medecin/restorepassword/${token}`;
      const emailBody = `
                              <h3>Cher ${userNameMedecin}!</h3>
                              <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                              <a href='${url}'>${url}</a>
                              <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                              <p>Cordialement,</p>
                              <p>L'équipe de Sina.</p>`;

      await sendMail(value.email, "Restaurer votre mot de passe ✔", emailBody);
      res.end();
    } else res.status(400).send({ type: "no_account_found" });
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
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
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      });
    }
  }
};

const getDoctorInfoById = async (req, res) => {
  try {
    const value = await validateBody("validId", req.params);
    const medecin = await selectMedecinById(value.id);
    delete medecin.dataValues.passwordMedecin;
    res.send(medecin);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.status(500).send({ error: "internal_server_error" });
  }
};

const medecinGetMyInfo = (req, res) => {
  let statement =
    "SELECT Distinct userNameMedecin,sexeMedecin,autoAccept,nomMedecin,prenomMedecin,NumTlfMedecin,mailMedecin,nomDaira,nomWilaya FROM medecin m,daira d,wilaya w WHERE m.idMedecin=? and m.idDaira=d.idDaira and d.idWilaya=w.idWilaya;SELECT count(*) as numberReport FROM rapport r,patient p WHERE r.idPatient=p.idPatient and p.idMedecin=?;SELECT count(*) as numberPatient FROM patient WHERE idMedecin=?;SELECT count(*) as numberPatientAtt FROM listatt WHERE idMedecin=?;";
  dbPool.query(
    statement,
    [req.autData.id, req.autData.id, req.autData.id, req.autData.id],
    (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.send({ results: result });
    }
  );
};

const medecinGetMail = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    res.send({ mailMedecin: medecin?.mailMedecin });
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinGetUsername = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    res.send({ userNameMedecin: medecin?.userNameMedecin });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const medecinGetName = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    res.send({
      nomMedecin: medecin?.nomMedecin,
      prenomMedecin: medecin?.prenomMedecin,
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinGetNumber = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    res.send({ NumTlfMedecin: medecin?.NumTlfMedecin });
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinGetAutoAccept = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    res.send({ autoAccept: medecin?.autoAccept });
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinGetDaira = async (req, res) => {
  try {
    const medecin = await selectMedecinById(req.params.id);
    delete medecin?.daira?.dataValues?.wilaya;
    res.send(medecin?.daira);
  } catch (error) {
    res.sendStatus(500);
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
  getDoctorInfoById,
  medecinGetMyInfo,
  medecinGetMail,
  medecinGetUsername,
  medecinGetName,
  medecinGetNumber,
  medecinGetAutoAccept,
  medecinGetDaira,
};
