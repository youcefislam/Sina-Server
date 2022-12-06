const patientQuery = require("../Routes/patient/queries");

require("dotenv").config();

const { validateAccessToken } = require("../Utilities/utility");

function socketError(err, code, message) {
  const error = new Error(err);
  error.data = {
    code,
    message,
  };
  return error;
}

const tokenAuthorization = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      req.token = bearerHeader.split(" ")[1];
      const valid = await validateAccessToken(req.token);
      req.autData = valid;
      next();
    } else res.sendStatus(401);
  } catch (error) {
    res.sendStatus(403);
  }
};
const socketTokenAuthorization = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (token == null) {
      const error = new Error("No token Error");
      error.data = { code: "NO_TOKEN_ASSIGNED" };
      next(error);
    }
    const valid = await validateAccessToken(token);
    socket.autData = valid;
    next();
  } catch (error) {
    const err = new Error(error.message);
    err.data = { code: "INVALID_TOKEN" };
    next(err);
  }
};

const socketAccountIdentification = async (socket, next) => {
  try {
    const authenticationData = socket.autData;

    if (authenticationData.patient) {
      const patient = await patientQuery.selectPatientMinimal({
        id: authenticationData.id,
      });
      if (patient?.id_doctor == null)
        return next(
          new socketError(
            "Not authorized",
            "not_authorized",
            "Patient account not attached to a doctor"
          )
        );
      socket.autData.id_doctor = patient.id_doctor;
      next();
    } else next();
  } catch (error) {
    console.log(error);
    next(socketError("Not authorized", "Token_validation_error"));
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
  if (req.autData?.id == req.params[0]) return next();
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

const transformQuery = async (req, res, next) => {
  if (req.query)
    Object.keys(req.query).forEach((key, index) => {
      if (key == "page" || key == "limit")
        req.query[key] = parseInt(req.query[key]);
    });
  next();
};

const parseParams = async (req, res, next) => {
  Object.keys(req.params).forEach(
    (key) => (req.params[key] = parseInt(req.params[key]))
  );
  next();
};

module.exports = {
  tokenAuthorization,
  socketTokenAuthorization,
  socketAccountIdentification,
  doctorOnly,
  patientOnly,
  private,
  validation,
  transformQuery,
  parseParams,
};
