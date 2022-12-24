const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Alert router
// send alert
Router.post(
  "/",
  middleware.validation(schema.sendAlert, "body"),
  controllers.sendAlert
);

module.exports = Router;
