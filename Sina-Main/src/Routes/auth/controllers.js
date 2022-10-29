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
  selectAllMedecin,
  deleteMedecinAccount,
  updateMedecin,
  selectMedecinsPatientList,
  selectDoctor_sensitive,
  validateAccount,
  searchDoctor,
} = require("./queries.js");

const { updatePatient, searchPatient } = require("../patient/queries.js");

const medecinSignUp = async (req, res) => {
  let insertId;

  try {
    const body = await validateBody("medecinSignUp", req.body);
    body.password = await hashPassword(body.password);
    body.photo = req.file ? req.file.path : null;

    insertId = await insertMedecin(body);
    await insertNotVerifiedMedecin(insertId);
    const token = await generateToken({
      id: insertId,
      username: body.userNameMedecin,
    });
    const url = `http://localhost:3000/confirmation/${token}`;
    const emailBody = `
              <h3>Cher ${body.username}!</h3>
              <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
              <a href='${url}'>${url}</a>
              <p>Cordialement,</p>
              <p>L'équipe de Sina.</p>`;
    await sendMail(body.mail, "Vérifiez votre adresse e-mail ✔", emailBody);
    res.status(201).send({ token });
  } catch (error) {
    if (insertId) deleteMedecinAccount(insertId);
    if (
      error.type == "duplicated_entry_error" ||
      error.type == "validation_error"
    )
      res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinSignIn = async (req, res) => {
  try {
    const body = await validateBody("medecinSignIn", req.body);
    const medecin = await selectDoctor_sensitive({ username: body.username });
    if (medecin) {
      const correctPassword = await comparePassword(
        body.password,
        medecin.password
      );
      if (correctPassword) {
        const token = await generateToken({
          id: medecin.id,
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
    else res.sendStatus(500);
  }
};

const medecinValidateAccount = async (req, res) => {
  try {
    const valid = await validateToken(req.params.token);
    console.log(valid);
    await validateAccount(valid.id);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};

const medecinDeleteAccount = async (req, res) => {
  try {
    await deleteMedecinAccount(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinModifyMail = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);
    await updateMedecin(value, req.params);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinModifyUsername = async (req, res) => {
  try {
    const value = await validateBody("validUsername", req.body);
    await updateMedecin(value, req.params);
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
    else res.sendStatus(500);
  }
};

const medecinModifyPassword = async (req, res) => {
  try {
    const value = await validateBody("validNewPassword", req.body);
    const password = await hashPassword(value.password);

    await updateMedecin({ password }, req.params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinModifyName = async (req, res) => {
  try {
    const value = await validateBody("validName", req.body);
    await updateMedecin(value, req.params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinModifyNumber = async (req, res) => {
  try {
    const value = await validateBody("validNumber", req.body);
    value.phone_number =
      value.phone_number[0] == "0"
        ? value.phone_number.slice(1)
        : value.phone_number;
    await updateMedecin(value, req.params);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinModifyAutoAccept = async (req, res) => {
  try {
    const value = await validateBody("validAccept", req.body);
    await updateMedecin(value, req.params);
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinModifyDaira = async (req, res) => {
  try {
    const value = await validateBody("validDaira", req.body);
    await updateMedecin(value, req.params);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error" || error.type == "invalid_data")
      res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const medecinGetPatientList = async (req, res) => {
  try {
    const patientList = await selectMedecinsPatientList(req.params.id);
    res.send({ results: patientList });
  } catch (error) {
    res.sendStatus(500);
  }
};

const medecinRemovePatient = async (req, res) => {
  try {
    const { id_doctor } = await searchPatient({ id: req.params.id_patient });

    if (id_doctor == req.params.id) {
      await updatePatient({ id_doctor: null }, { id: req.params.id_patient });
      res.sendStatus(204);
    } else res.status(400).send({ type: "patient_not_found" });
  } catch (error) {
    if (error.type == "invalid_data") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const getListOfDoctors = async (req, res) => {
  try {
    const results = await selectAllMedecin();
    res.send({ results });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const medecinSendRestoreLink = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);

    const medecin = await searchDoctor(value);

    if (medecin) {
      const { id, username, mail } = medecin;
      const token = await generateToken(
        { id, username, reset_password: true },
        {
          expiresIn: "2h",
        }
      );
      const url = `http://localhost:3000/medecin/restorepassword/${token}`;
      const emailBody = `
                              <h3>Cher ${username}!</h3>
                              <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                              <a href='${url}'>${url}</a>
                              <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                              <p>Cordialement,</p>
                              <p>L'équipe de Sina.</p>`;

      await sendMail(mail, "Restaurer votre mot de passe ✔", emailBody);
      res.sendStatus(204);
    } else res.status(400).send({ type: "no_account_found" });
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const getDoctorInfoById = async (req, res) => {
  try {
    const value = await validateBody("validId", req.params);
    const result = await searchDoctor(value);
    res.send({ result });
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const searchForDoctor = async (req, res) => {
  try {
    const valid = await validateBody("doctorSearchQuery", req.query);
    const results = await searchDoctor(req.query);
    res.send({ results });
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
  }
};

const checkIfDoctorExist = async (req, res) => {
  try {
    const doctor = await searchDoctor(req.params);
    if (doctor) res.ok();
    else res.sendStatus(401);
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
  getDoctorInfoById,
  searchForDoctor,
  checkIfDoctorExist,
};
