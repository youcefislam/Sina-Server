const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const signUp = async (req, res) => {
  let newPatientId;
  try {
    req.body.password = await utility.hashValue(req.body.password);
    newPatientId = await query.insertPatient(req.body);

    const validation_code = utility.createValidationCode();
    await query.insertPatientNotVerified(newPatientId, validation_code);

    const emailBody = `
    <h3>Cher ${req.body.username}!</h3>
    <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
    <p style="font-weight: bold;color: #0DBDA5;">${validation_code}</p>
    <p>Cordialement,</p>
    <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      req.body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );

    res.send({ validation_code });
  } catch (error) {
    console.log(error);
    if (newPatientId) query.deletePatient(newPatientId);
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const signIn = async (req, res) => {
  try {
    const patient = await query.selectPatient_sensitive({
      username: req.body.username,
    });

    if (patient == null)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "username" });

    const isNotVerified = await query.selectValidationCode(patient.id);
    if (isNotVerified)
      return res.status(403).send({
        code: "account_not_verified",
      });

    const isCorrectPassword = await utility.compareHashedValues(
      req.body.password,
      patient.password
    );

    if (!isCorrectPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "password" });

    const tokenData = {
      id: patient.id,
      patient: 1,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "30m",
    });
    const REFRESH_TOKEN = await utility.generateRefreshToken(tokenData, {
      expiresIn: "2y",
    });

    const logInfo = {
      token: await utility.hashValue(REFRESH_TOKEN),
      platform: req.header("user-agent"),
      ip: req.ip,
      id_patient: patient.id,
    };
    await query.insertPatientLogInfo(logInfo);

    return res.send({ ACCESS_TOKEN, REFRESH_TOKEN });
  } catch (error) {
    res.sendStatus(500);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const REFRESH_TOKEN = req.token;

    const logInfo = await query.selectPatientLogInfo({
      id_patient: req.autData.id,
    });

    if (!logInfo.length) return res.sendStatus(403);

    const logged = logInfo.find(
      async (info) =>
        await utility.compareHashedValues(REFRESH_TOKEN, info.token)
    );

    if (!logged) return res.sendStatus(403);

    const tokenData = {
      id: req.autData.id,
      patient: 1,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "30m",
    });
    return res.send({ ACCESS_TOKEN });
  } catch (error) {
    res.sendStatus(500);
  }
};

const signOut = async (req, res) => {
  try {
    const REFRESH_TOKEN = req.token;

    const logInfo = await query.selectPatientLogInfo({
      id_patient: req.autData.id,
    });

    if (!logInfo.length) return res.sendStatus(403);

    const logged = logInfo.find(
      async (info) =>
        await utility.compareHashedValues(REFRESH_TOKEN, info.token)
    );

    if (!logged) return res.sendStatus(403);

    await query.deletePatientLogInfo(logged.id);

    return res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const resendValidationCode = async (req, res) => {
  let deleteQuery, patient;
  try {
    patient = await query.selectPatient_sensitive(req.body);

    if (patient == null) return res.status(400).send({ code: "no_row_found" });

    deleteQuery = await query.deleteValidationCode(patient.id);

    if (deleteQuery.affectedRows == 0)
      return res.status(400).send({
        code: "account_already_verified",
        message: "Account already verified",
      });

    const validation_code = utility.createValidationCode();
    await query.insertPatientNotVerified(patient.id, validation_code);

    const emailBody = `
    <h3>Cher ${patient.username}!</h3>
    <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
    <p style="font-weight: bold;color: #0DBDA5;">${validation_code}</p>
    <p>Cordialement,</p>
    <p>L'équipe de Sina.</p>`;

    await utility.sendMail(
      patient.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );
    res.send({ validation_code });
  } catch (error) {
    console.log(error);
    if (deleteQuery) query.insertPatientNotVerified(patient.id, null);
    res.sendStatus(500);
  }
};

const validateAccount = async (req, res) => {
  try {
    const patient = await query.selectPatient_sensitive({
      mail: req.body.mail,
    });
    if (patient == null) return res.status(400).send({ code: "row_not_found" });

    const correctValidation_code = await query.selectValidationCode(patient.id);

    if (!correctValidation_code) return res.sendStatus(403);
    if (correctValidation_code != req.body.validation_code)
      return res.status(400).send({
        code: "incorrect_information",
        message: "incorrect validation_code",
      });

    await query.deleteValidationCode(patient.id);

    const tokenData = {
      id: patient.id,
      patient: 1,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "30m",
    });
    const REFRESH_TOKEN = await utility.generateRefreshToken(tokenData, {
      expiresIn: "2y",
    });

    const logInfo = {
      token: await utility.hashValue(REFRESH_TOKEN),
      platform: req.header("user-agent"),
      ip: req.ip,
      id_patient: patient.id,
    };
    await query.insertPatientLogInfo(logInfo);

    return res.send({ ACCESS_TOKEN, REFRESH_TOKEN });
  } catch (error) {
    res.sendStatus(500);
  }
};

const sendRestoreLink = async (req, res) => {
  try {
    const patient = await query.selectPatient_sensitive(req.body);

    if (!patient) return res.status(400).send({ code: "row_not_found" });
    const { id, username, mail } = patient;
    const token = await utility.generateValidationToken(
      { id, reset_password: true },
      { expiresIn: "10m" }
    );
    console.log(token);
    const url = `http://localhost:4000/doctor/reset_password/?token=${token}`;
    const emailBody = `
                              <h3>Cher ${username}!</h3>
                              <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                              <a href='${url}'>${url}</a>
                              <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                              <p>Cordialement,</p>
                              <p>L'équipe de Sina.</p>`;
    await utility.sendMail(mail, "Recuperation du mot de passe ✔", emailBody);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const autData = await utility.validateValidationToken(req.query.token);
    const patient = await query.selectPatient_sensitive({ id: autData.id });

    if (!patient) return res.status(400).send({ code: "row_not_found" });

    const password = await utility.hashValue(req.body.password);

    await query.updatePatient({ password }, { id: autData.id });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  signUp,
  signIn,
  refreshAccessToken,
  signOut,
  resendValidationCode,
  validateAccount,
  sendRestoreLink,
  resetPassword,
};
