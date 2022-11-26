const jwt = require("jsonwebtoken");
const Joi = require("joi");
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
  if (req.autData.patient) return res.status(400).send({ code: "doctor_only" });
  next();
};

const patientOnly = async (req, res, next) => {
  if (req.autData.patient) return next();
  res.status(400).send({ code: "patient_only" });
};

const private = async (req, res, next) => {
  if (req.autData?.id == req.params?.id) return next();
  res.status(400).send({ code: "private_access" });
};

const validation = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[property]);

      next();
    } catch (error) {
      const type = error.details[0].type;
      const path = error.details[0].path[0];
      const message = error.details[0].message;
      const code = "validation_error";
      res.status(422).send({ code, type, message, path });
    }
  };
};

module.exports = {
  tokenAuthorization,
  doctorOnly,
  patientOnly,
  private,
  validation,
};
