const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// Alert router
// send alert
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.sendAlert, "body"),
  controllers.sendAlert
);

module.exports = Router;
