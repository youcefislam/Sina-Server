const jwt = require("jsonwebtoken");
require("dotenv").config();

const { validateAccessToken } = require("../Utilities/utility");

const tokenAuthorization = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      req.token = bearerHeader.split(" ")[1];
      const valid = await validateAccessToken(req.token);
      req.autData = valid;
      next();
    } else res.status(401);
  } catch (error) {
    res.sendStatus(403);
  }
};

const doctorOnly = async (req, res, next) => {
  if (req.autData.patient) return res.status(400).send({ type: "doctor_only" });
  next();
};

const patientOnly = async (req, res, next) => {
  if (req.autData.patient) return next();
  res.status(400).send({ type: "patient_only" });
};

const private = async (req, res, next) => {
  if (req.autData?.id == req.params?.id) return next();
  res.status(400).send({ type: "private_access" });
};

module.exports = {
  tokenAuthorization,
  doctorOnly,
  patientOnly,
  private,
};
