const express = require("express");

const { sendAlert } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// Alerts router
// send alert.  -- got error with twilio usage
Router.post("/send", tokenAuthorization, sendAlert);

module.exports = Router;
