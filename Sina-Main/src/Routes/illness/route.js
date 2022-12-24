const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// illness route
// Get illness list endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getIllnessList
);

// Add a type of illness endpoint
Router.post(
  "/",
  middleware.validation(schema.type, "body"),
  controllers.addIllness
);

// Update a type of illness endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.type, "body"),
  controllers.updateIllness
);

// Delete a type of illness endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteIllness);

module.exports = Router;
