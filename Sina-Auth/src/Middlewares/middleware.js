require("dotenv").config();

const {
  validateRefreshToken,
  validateValidationToken,
} = require("../Utilities/utility");

const cookieTokenAuthorization = async (req, res, next) => {
  try {
    const REFRESH_TOKEN = req.signedCookies.REFRESH_TOKEN;
    if (REFRESH_TOKEN) {
      const valid = await validateRefreshToken(REFRESH_TOKEN);
      req.autData = valid;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(403);
  }
};

const headerTokenAuthorization = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      req.token = bearerHeader.split(" ")[1];
      const valid = await validateRefreshToken(req.token);
      req.autData = valid;
      next();
    } else res.sendStatus(401);
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
