const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// Alert router
// send alert
Router.post("/", middleware.tokenAuthorization, controllers.sendAlert);

module.exports = Router;
