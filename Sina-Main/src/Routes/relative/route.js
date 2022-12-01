const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// relative route
// get relative info by patient id endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.getRelativeInfo
);

// Add patient's relative endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.validation(schema.addRelative, "body"),
  controllers.addRelative
);

// Modify relative info endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.patientOnly,
  middleware.private,
  middleware.validation(schema.updateRelative, "body"),
  controllers.updateRelative
);

// delete patient's relative endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.patientOnly,
  middleware.private,
  controllers.deleteRelative
);

module.exports = Router;
