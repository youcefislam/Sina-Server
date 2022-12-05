const query = require("./queries");
const utility = require("../../Utilities/utility");

const signUp = async (req, res, next) => {
  let newDoctorId;
  try {
    req.body.password = await utility.hashValue(req.body.password);
    req.body.photo = req.file ? req.file.path : null;

    newDoctorId = await query.insertDoctor(req.body);
    await query.insertDoctorNotVerified(newDoctorId);

    const validation_token = await utility.generateValidationToken(
      { id: newDoctorId },
      { expiresIn: "2h" }
    );
    console.log(validation_token);
    const url = `http://localhost:4000/doctor/verify_account?token${validation_token}`;
    const emailBody = `
                <h3>Cher ${req.body.username}!</h3>
                <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                <a href='${url}'>${url}</a>
                <p>Cordialement,</p>
                <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      req.body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );

    res.sendStatus(201);
  } catch (error) {
    if (newDoctorId) query.deleteDoctor(newDoctorId);
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const doctor = await query.selectDoctor_sensitive({
      username: req.body.username,
    });

    if (doctor == null)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "username" });

    const isNotVerified = await query.selectNotVerifiedDoctor(doctor.id);
    if (isNotVerified)
      return res.status(403).send({
        code: "account_not_verified",
        message:
          "check your email and click the account verification link to validate your account",
      });

    const correctPassword = await utility.compareHashedValues(
      req.body.password,
      doctor.password
    );
    if (!correctPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "password" });

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
    return res.status(201).send({ ACCESS_TOKEN });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
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
    return res.send({ ACCESS_TOKEN });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
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
    next(error);
  }
};

const validateAccount = async (req, res) => {
  try {
    const options = await utility.validateValidationToken(req.query.token);
    await query.validateDoctorAccount(options.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const resendValidationLink = async (req, res, next) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.body);

    if (doctor == null) return res.status(400).send({ code: "row_not_found" });

    const validation_token = await utility.generateValidationToken(
      { id: doctor.id },
      { expiresIn: "2h" }
    );

    const url = `http://localhost:4000/doctor/verify_account?token=${validation_token}`;
    const emailBody = `
                      <h3>Cher ${doctor.username}!</h3>
                      <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                      <a href='${url}'>${url}</a>
                      <p>Cordialement,</p>
                      <p>L'équipe de Sina.</p>`;
    await utility.sendMail(
      req.body.mail,
      "Vérifiez votre adresse e-mail ✔",
      emailBody
    );
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const sendRestoreLink = async (req, res, next) => {
  try {
    const doctor = await query.selectDoctor_sensitive(req.body);

    if (!doctor) return res.status(400).send({ code: "row_not_found" });
    const { id, username, mail } = doctor;
    const token = await utility.generateResetToken(
      { id, reset_password: true },
      { expiresIn: "10m" }
    );
    const url = `http://localhost:4000/doctor/reset_password?token=${token}`;
    const emailBody = `
                              <h3>Cher ${username}!</h3>
                              <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                              <a href='${url}'>${url}</a>
                              <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                              <p>Cordialement,</p>
                              <p>L'équipe de Sina.</p>`;
    console.log(token);
    await utility.sendMail(mail, "Recuperation du mot de passe ✔", emailBody);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const autData = await utility.validateResetToken(req.query.token);
    const password = await utility.hashValue(req.body.password);

    const updateQuery = await query.updateDoctor(
      { password },
      { id: autData.id }
    );
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

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
  validateAccount,
  resendValidationLink,
  sendRestoreLink,
  resetPassword,
};
