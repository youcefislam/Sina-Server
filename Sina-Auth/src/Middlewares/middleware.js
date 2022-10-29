const jwt = require("jsonwebtoken");
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

module.exports = {
  cookieTokenAuthorization,
  headerTokenAuthorization,
  validationTokenAuthorization,
  doctorOnly,
  patientOnly,
};
