const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// appointment route
// Add appointment endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.addAppointment, "body"),
  controllers.addAppointment
);

// get appointment endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.getAppointment
);

// update an appointment endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.validDate, "body"),
  controllers.updateAppointment
);

// Cancel an appointment endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.cancelAppointment
);

// get appointments list endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAppointmentList
);

// get appointments journal endpoint
Router.get(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAppointmentJournal
);

// archive appointment endpoint
Router.post(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.validId, "body"),
  controllers.archiveAppointment
);

module.exports = Router;
