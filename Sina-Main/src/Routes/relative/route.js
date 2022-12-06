const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// relative route
// get relative info by patient id endpoint
Router.get(/^\/(\d+)$/, middleware.parseParams, controllers.getRelativeInfo);

// Add patient's relative endpoint
Router.post(
  "/",
  middleware.patientOnly,
  middleware.validation(schema.addRelative, "body"),
  controllers.addRelative
);

// Modify relative info endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.patientOnly,
  middleware.private,
  middleware.validation(schema.updateRelative, "body"),
  controllers.updateRelative
);

// delete patient's relative endpoint
Router.delete(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.patientOnly,
  middleware.private,
  controllers.deleteRelative
);

module.exports = Router;
