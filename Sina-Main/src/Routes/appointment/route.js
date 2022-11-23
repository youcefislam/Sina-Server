const express = require("express");
const controllers = require("./controllers");

const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// appointment route
// Add appointment endpoint
Router.post("/", middleware.tokenAuthorization, controllers.addAppointment);

// get appointment endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getAppointment);

// update an appointment endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  controllers.updateAppointment
);

// Cancel an appointment endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  controllers.cancelAppointment
);

// get appointments list endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  controllers.getAppointmentList
);

// get appointments journal endpoint
Router.get(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  controllers.getAppointmentJournal
);

// archive appointment endpoint
Router.post(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  controllers.archiveAppointment
);

module.exports = Router;
