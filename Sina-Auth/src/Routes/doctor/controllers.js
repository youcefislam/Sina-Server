const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const signUp = async (req, res) => {
  let newDoctorId;
  try {
    const body = await validateBody("doctorSignUp", req.body);
    body.password = await utility.hashValue(body.password);
    body.photo = req.file ? req.file.path : null;

    newDoctorId = await query.insertDoctor(body);
    await query.insertDoctorNotVerified(newDoctorId);

    const validation_token = await utility.generateValidationToken(
      { id: newDoctorId },
      { expiresIn: "2h" }
    );

    const url = `http://localhost:4000/doctor/verify_account/${validation_token}`;
    console.log(validation_token);
    const emailBody = `
                <h3>Cher ${body.username}!</h3>
                <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                <a href='${url}'>${url}</a>
                <p>Cordialement,</p>
                <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );

    res.sendStatus(201);
  } catch (error) {
    if (newDoctorId) await query.deleteDoctor(newDoctorId);
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

    const doctor = await query.selectDoctor_sensitive({
      username: body.username,
    });

    if (doctor == null)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "username" });

    const isNotVerified = await query.selectNotVerifiedDoctor(doctor.id);
    if (isNotVerified)
      return res.status(403).send({
        type: "account_not_verified",
        message:
          "check your email and click the account verification link to validate your account",
      });

    const correctPassword = await utility.compareHashedValues(
      body.password,
      doctor.password
    );
    if (!correctPassword)
      return res
        .status(400)
        .send({ type: "incorrect_information", path: "password" });

    const tokenData = {
      id: doctor.id,
    };
    const ACCESS_TOKEN = await utility.generateAccessToken(tokenData, {
      expiresIn: "30m",
    });
    const REFRESH_TOKEN = await utility.generateRefreshToken(tokenData, {
      expiresIn: "2y",
    });
    await query.insertDoctorLogInfo({
      token: await utility.hashValue(REFRESH_TOKEN),
      platform: req.header("user-agent"),
      ip: req.ip,
      id_doctor: doctor.id,
    });

    res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      httpOnly: true,
      signed: true,
    });
    return res.status(201).send({ token: ACCESS_TOKEN });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const REFRESH_TOKEN = req.signedCookies.REFRESH_TOKEN;
    const logInInfo = await query.selectDoctorLoginInfo({
      id_doctor: req.autData.id,
    });

    if (!logInInfo.length) return res.sendStatus(403);

    const logged = logInInfo.find(
      async (info) =>
        await utility.compareHashedValues(REFRESH_TOKEN, info.token)
    );

    if (!logged) return res.sendStatus(403);

    const ACCESS_TOKEN = await utility.generateAccessToken(
      { id: req.autData.id },
      { expiresIn: "30m" }
    );
    return res.send({ token: ACCESS_TOKEN });
  } catch (error) {
    res.sendStatus(500);
  }
};

const signOut = async (req, res) => {
  try {
    const REFRESH_TOKEN = req.signedCookies.REFRESH_TOKEN;
    const logInInfo = await query.selectDoctorLoginInfo({
      id_doctor: req.autData.id,
    });

    if (!logInInfo.length) return res.sendStatus(403);

    const logged = logInInfo.find(
      async (info) =>
        await utility.compareHashedValues(REFRESH_TOKEN, info.token)
    );

    if (!logged) return res.sendStatus(403);

    await query.deleteDoctorLogInInfo(logged.id);
    res.clearCookie("REFRESH_TOKEN");
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const validateAccount = async (req, res) => {
  try {
    const params = await utility.validateValidationToken(req.params.token);
    await query.validateDoctorAccount(params.id);
    res.sendStatus(204);
  } catch (error) {
    console.log(error.name);
    if (error.name == "JsonWebTokenError" || error.name == "TokenExpiredError")
      return res
        .status(400)
        .send({ type: "not_valid", message: "invalid link" });
    res.sendStatus(500);
  }
};

const resendValidationLink = async (req, res) => {
  try {
    const body = await validateBody("validMail", req.body);
    const doctor = await query.selectDoctor_sensitive(body);

    if (doctor == null)
      return res.status(401).send({ type: "no_account_found" });

    const validation_token = await utility.generateValidationToken(
      { id: doctor.id },
      { expiresIn: "2h" }
    );

    const url = `http://localhost:4000/doctor/verify_account/${validation_token}`;
    const emailBody = `
                      <h3>Cher ${doctor.username}!</h3>
                      <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                      <a href='${url}'>${url}</a>
                      <p>Cordialement,</p>
                      <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const sendRestoreLink = async (req, res) => {
  try {
    const value = await validateBody("validMail", req.body);

    const doctor = await query.selectDoctor_sensitive(value);

    if (!doctor) return res.status(400).send({ type: "no_account_found" });
    const { id, username, mail } = doctor;
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
    const doctor = await query.selectDoctor_sensitive({ id: req.autData.id });

    if (!doctor) return res.status(403).send({ type: "no_account_found" });

    const password = await utility.hashValue(body.password);

    await query.updateDoctor({ password }, { id: req.autData.id });
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
  validateAccount,
  resendValidationLink,
  sendRestoreLink,
  resetPassword,
};
