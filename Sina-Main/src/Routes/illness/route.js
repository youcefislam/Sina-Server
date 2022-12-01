const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// illness route
// Get illness list endpoint
Router.get(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.page, "query"),
  controllers.getIllnessList
);

// Add a type of illness endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.type, "body"),
  controllers.addIllness
);

// Update a type of illness endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.type, "body"),
  controllers.updateIllness
);

// Delete a type of illness endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.deleteIllness
);

module.exports = Router;
