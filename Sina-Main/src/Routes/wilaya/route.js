const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Wilaya router
// Get the list of wilaya endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getWilayaList
);

// add wilaya endpoint
Router.post(
  "/",
  middleware.validation(schema.name, "body"),
  controllers.addWilaya
);

// update wilaya endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.name, "body"),
  controllers.updateWilaya
);

// delete wilaya endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteWilaya);

module.exports = Router;
