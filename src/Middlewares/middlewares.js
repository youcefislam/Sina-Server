const jwt = require("jsonwebtoken");
require("dotenv").config();

const { validateToken } = require("../Utilities/utility");

const tokenAuthorization = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      req.token = bearerHeader.split(" ")[1];
      const valid = await validateToken(req.token);
      req.autData = valid;
      next();
    } else res.status(401);
  } catch (error) {
    res.status(401);
  }
};

const medecinOnly = async (req, res, next) => {
  if (req.autData.patient) res.sendStatus(403);
  else next();
};

const patientOnly = async (req, res, next) => {
  if (req.autData.patient) next();
  else res.sendStatus(403);
};

const private = async (req, res, next) => {
  if (req.autData.id == req.params.id) next();
  else res.sendStatus(403);
};

module.exports = {
  tokenAuthorization,
  medecinOnly,
  patientOnly,
  private,
};
