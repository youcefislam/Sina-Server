const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

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
  "/:id",
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.name, "body"),
  controllers.updateWilaya
);

// delete wilaya endpoint
Router.delete(
  "/:id",
  middleware.validation(schema.validId, "params"),
  controllers.deleteWilaya
);

module.exports = Router;
