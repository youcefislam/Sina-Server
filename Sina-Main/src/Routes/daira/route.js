const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

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
  "/:id",
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.name, "body"),
  controllers.updateDaira
);

// delete daira endpoint
Router.delete(
  "/:id",
  middleware.validation(schema.validId, "params"),
  controllers.deleteDaira
);

module.exports = Router;
