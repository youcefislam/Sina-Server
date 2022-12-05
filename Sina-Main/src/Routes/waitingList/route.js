const express = require("express");
const controller = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// Waiting list route
// Get the waiting list of the doctor endpoint
Router.get(
  "/",
  middleware.doctorOnly,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controller.getWaitingList
);

// Insert a patient request to the doctor's waiting list
Router.post(
  "/",
  middleware.patientOnly,
  middleware.validation(schema.addPatientRequest, "body"),
  controller.addRequest
);

// Accept/Reject a request endpoint
Router.delete(
  "/",
  middleware.doctorOnly,
  middleware.validation(schema.patientRequest, "query"),
  controller.deleteRequest
);

module.exports = Router;
