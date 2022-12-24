const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Daira router
// Get the list of daira endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getDairaList
);

// add daira endpoint
Router.post(
  "/",
  middleware.validation(schema.addDairaBody, "body"),
  controllers.addDaira
);

// update daira endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.name, "body"),
  controllers.updateDaira
);

// delete daira endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteDaira);

module.exports = Router;
