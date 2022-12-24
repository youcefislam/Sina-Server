require("dotenv").config();

const {
  validateRefreshToken,
  validateValidationToken,
  compareHashedValues,
} = require("../utilities/utility");
const doctorQuery = require("../routes/doctor/queries");
const patientQuery = require("../routes/patient/queries");

const cookieTokenAuthorization = async (req, res, next) => {
  try {
    const REFRESH_TOKEN = req.signedCookies.REFRESH_TOKEN;
    if (REFRESH_TOKEN) {
      const valid = await validateRefreshToken(REFRESH_TOKEN);

      const doctor = await doctorQuery.selectDoctor_sensitive({
        username: valid.username,
      });
      if (!doctor)
        return res.status(401).send({ code: "unauthorized", path: "username" });

      const correctPassword = await compareHashedValues(
        valid.password,
        doctor.password
      );
      if (!correctPassword)
        return res.status(401).send({ code: "unauthorized", path: "password" });

      const logInInfo = await doctorQuery.selectDoctorLoginInfo({
        id_doctor: valid.id,
      });

      const logged = logInInfo.find(
        async (info) => await compareHashedValues(REFRESH_TOKEN, info.token)
      );

      if (!logged) return res.sendStatus(403);

      req.autData = { ...valid, logId: logged.id };
      next();
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};

const headerTokenAuthorization =
  (type = false) =>
  async (req, res, next) => {
    try {
      const bearerHeader = req.headers["authorization"];
      if (!bearerHeader) res.sendStatus(401);

      req.token = bearerHeader.split(" ")[1];
      const valid = await validateRefreshToken(req.token);

      if (!type && valid.notVerified)
        return res.status(401).send({ code: "account_not_verified" });

      const patient = await patientQuery.selectPatient_sensitive({
        username: valid.username,
      });
      if (!patient)
        return res.status(401).send({ code: "unauthorized", path: "username" });

      const correctPassword = await compareHashedValues(
        valid.password,
        patient.password
      );
      if (!correctPassword)
        return res.status(401).send({ code: "unauthorized", path: "password" });

      const logInfo = await patientQuery.selectPatientLogInfo({
        id_patient: valid.id,
      });

      const logged = logInfo.find(
        async (info) => await compareHashedValues(req.token, info.token)
      );

      if (!type && !logged)
        return res.status(401).send({ code: "suspicious_token" });

      req.autData = { ...valid, logId: logged?.id };
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(403);
    }
  };

const validationTokenAuthorization = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      req.token = bearerHeader.split(" ")[1];
      const valid = await validateValidationToken(req.token);
      req.autData = valid;
      next();
    } else res.sendStatus(401);
  } catch (error) {
    res.sendStatus(403);
  }
};

const doctorOnly = async (req, res, next) => {
  if (req.autData.patient) return res.sendStatus(403);
  else next();
};

const patientOnly = async (req, res, next) => {
  if (req.autData.patient) return next();
  res.sendStatus(403);
};

const validation = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[property]);

      next();
    } catch (error) {
      console.log(error);
      const type = error.details[0].type;
      const path = error.details[0].path[0];
      const message = error.details[0].message;
      const code = "validation_error";
      res.status(422).send({ code, type, message, path });
    }
  };
};

module.exports = {
  cookieTokenAuthorization,
  headerTokenAuthorization,
  validationTokenAuthorization,
  doctorOnly,
  validation,
  patientOnly,
};
