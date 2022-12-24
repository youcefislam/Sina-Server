const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// appointment route
// Add appointment endpoint
Router.post(
  "/",
  middleware.validation(schema.addAppointment, "body"),
  controllers.addAppointment
);

// get appointment endpoint
Router.get(/^\/(\d+)$/, middleware.parseParams, controllers.getAppointment);

// update an appointment endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.validDate, "body"),
  controllers.updateAppointment
);

// Cancel an appointment endpoint
Router.delete(
  /^\/(\d+)$/,
  middleware.parseParams,
  controllers.cancelAppointment
);

// get appointments list endpoint
Router.get(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAppointmentList
);

// get appointments journal endpoint
Router.get(
  /^\/journal\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAppointmentJournal
);

// archive appointment endpoint
Router.post(
  /^\/journal\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.validId, "body"),
  controllers.archiveAppointment
);

module.exports = Router;
