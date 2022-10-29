const express = require("express");

const {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  archiveAppointment,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// appointment router
// Add an appointment endpoint
Router.post("/add", tokenAuthorization, addAppointment);

// update an appointment endpoint
Router.post("/update", tokenAuthorization, updateAppointment);

// Cancel an appointment endpoint
Router.post("/cancel", tokenAuthorization, cancelAppointment);

// Archive an appointment endpoint
Router.post("/archive", tokenAuthorization, archiveAppointment);

module.exports = Router;
