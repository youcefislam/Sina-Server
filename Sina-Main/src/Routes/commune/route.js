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
  "/:id",
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.name, "body"),
  controllers.updateCommune
);

// delete commune endpoint
Router.delete(
  "/:id",
  middleware.validation(schema.validId, "params"),
  controllers.deleteCommune
);

module.exports = Router;
