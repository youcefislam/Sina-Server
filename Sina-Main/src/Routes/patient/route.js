const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// patient router
// get patient info endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAllPatient
);

// get patient info endpoint
Router.get(/^\/(\d+)$/, middleware.parseParams, controllers.getPatientInfo);

// update patient's information endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.patientOnly,
  middleware.private,
  middleware.validation(schema.updatePatientInfo, "body"),
  controllers.updatePatient
);

// Delete patient account endpoint
Router.delete(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.patientOnly,
  middleware.private,
  middleware.validation(schema.validPassword, "body"),
  controllers.deleteAccount
);

// Modify patient's password endpoint
Router.put(
  /^\/(\d+)\/password$/,
  middleware.parseParams,
  middleware.patientOnly,
  middleware.private,
  middleware.validation(schema.validNewPassword, "body"),
  controllers.modifyPassword
);

module.exports = Router;
