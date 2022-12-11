const query = require("./queries");
const utility = require("../../Utilities/utility");

const signUp = async (req, res, next) => {
  let newPatientId;
  try {
    const password = req.body.password;
    req.body.password = await utility.hashValue(req.body.password);
    newPatientId = await query.insertPatient(req.body);

    const validation_code = utility.createValidationCode();
    await query.insertPatientNotVerified(newPatientId, validation_code);

    const tokenData = {
      id: newPatientId,
      username: req.body.username,
      password: req.body.password,
      notVerified: 1,
      password,
    };

    const REFRESH_TOKEN = await utility.generateRefreshToken(tokenData, {
      expiresIn: "30m",
    });

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

    res.send({ validation_code, REFRESH_TOKEN });
  } catch (error) {
    if (newPatientId) query.deletePatient(newPatientId);
    next(error);
  }
};

const signIn = async (req, res, next) => {
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
      username: req.body.username,
      password: req.body.password,
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

    res.send({ ACCESS_TOKEN, REFRESH_TOKEN });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    console.log("sfsdfs");
    const tokenData = {
      id: req.autData.id,
      username: req.autData.username,
      password: req.autData.password,
      patient: 1,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "30m",
    });
    return res.send({ ACCESS_TOKEN });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    await query.deletePatientLogInfo(req.autData.logId);

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const resendValidationCode = async (req, res, next) => {
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
    if (deleteQuery) query.insertPatientNotVerified(patient.id, null);
    next(error);
  }
};

const validateAccount = async (req, res, next) => {
  try {
    const correctValidation_code = await query.selectValidationCode(
      req.autData.id
    );
    if (!correctValidation_code) return res.sendStatus(403);

    if (correctValidation_code !== req.body.validation_code)
      return res.status(400).send({
        code: "incorrect_information",
        message: "incorrect validation_code",
      });

    await query.deleteValidationCode(req.autData.id);

    const tokenData = {
      id: req.autData.id,
      username: req.autData.username,
      password: req.autData.password,
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
      id_patient: req.autData.id,
    };
    await query.insertPatientLogInfo(logInfo);

    res.send({ ACCESS_TOKEN, REFRESH_TOKEN });
  } catch (error) {
    next(error);
  }
};

const sendRestoreLink = async (req, res, next) => {
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
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const autData = await utility.validateValidationToken(req.query.token);
    const patient = await query.selectPatient_sensitive({ id: autData.id });

    if (!patient) return res.status(400).send({ code: "row_not_found" });

    const password = await utility.hashValue(req.body.password);

    await query.updatePatient({ password }, { id: autData.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
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
