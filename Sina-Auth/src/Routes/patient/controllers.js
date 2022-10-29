const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const signUp = async (req, res) => {
  let newPatientId;
  try {
    const body = await validateBody("patientSignUp", req.body);

    body.password = await utility.hashValue(body.password);
    newPatientId = await query.insertPatient(body);

    const validation_code = utility.createValidationCode();
    await query.insertPatientNotVerified(newPatientId, validation_code);

    const emailBody = `
    <h3>Cher ${body.username}!</h3>
    <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
    <p style="font-weight: bold;color: #0DBDA5;">${validation_code}</p>
    <p>Cordialement,</p>
    <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );

    res.send({ validation_code });
  } catch (error) {
    if (newPatientId) query.deletePatient(newPatientId);
    if (
      error.type == "duplicated_entry_error" ||
      error.type == "validation_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const signIn = async (req, res) => {
  try {
    const body = await validateBody("signIn", req.body);
    const patient = await query.selectPatient_sensitive({
      username: body.username,
    });

    if (patient == null)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "username" });

    const isNotVerified = await query.selectValidationCode(patient.id);
    if (isNotVerified)
      return res.status(403).send({
        type: "account_not_verified",
        message:
          "check your email and click the account verification link to validate your account",
      });

    const isCorrectPassword = await utility.compareHashedValues(
      body.password,
      patient.password
    );

    if (!isCorrectPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "password" });

    const tokenData = {
      id: patient.id,
      patient: 1,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "15m",
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
    if (error.type == "validation_error") return res.status(400).send(error);
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
      expiresIn: "15m",
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
  try {
    const body = await validateBody("validMail", req.body);

    const patient = await query.selectPatient_sensitive(body.mail);

    if (patient == null)
      return res.status(403).send({ type: "no_account_found" });

    await query.deleteValidationCode(patient.id);

    const validation_code = utility.createValidationCode();
    await insertNotVerifiedPatient(patient.id, validation_code);

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
    res.sendStatus(500);
  }
};

const validateAccount = async (req, res) => {
  try {
    const body = await validateBody("validValidationCode", req.body);
    const patient = await query.selectPatient_sensitive({ mail: body.mail });
    if (patient == null)
      return res.status(403).send({ type: "no_account_found" });

    const correctValidation_code = await query.selectValidationCode(patient.id);

    if (!correctValidation_code) return res.sendStatus(403);
    if (correctValidation_code != body.validation_code)
      return res.status(400).send({
        type: "incorrect_information",
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
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const sendRestoreLink = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);

    const patient = await query.selectPatient_sensitive(value);

    if (!patient) return res.status(400).send({ type: "no_account_found" });
    const { id, username, mail } = patient;
    const token = await utility.generateValidationToken(
      { id, reset_password: true },
      { expiresIn: "2h" }
    );
    const url = `http://localhost:4000/doctor/reset_password/${token}`;
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
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const body = await validateBody("validNewPassword", req.body);
    const patient = await query.selectPatient_sensitive({ id: req.autData.id });

    if (!patient) return res.status(403).send({ type: "no_account_found" });

    const password = await utility.hashValue(body.password);

    await query.updatePatient({ password }, { id: req.autData.id });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") res.status(400).send(error);
    else res.sendStatus(500);
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
