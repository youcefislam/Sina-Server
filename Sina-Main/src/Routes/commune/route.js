const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// commune router
// Get the list of commune endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getCommuneList
);

// add commune endpoint
Router.post(
  "/",
  middleware.validation(schema.addCommuneBody, "body"),
  controllers.addCommune
);

// update commune endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.name, "body"),
  controllers.updateCommune
);

// delete commune endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteCommune);

module.exports = Router;
