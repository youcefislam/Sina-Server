const express = require("express");
const controller = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// Waiting list route
// Get the waiting list of the doctor endpoint
Router.get(
  "/",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.validation(schema.page, "query"),
  controller.getWaitingList
);

// Insert a patient request to the doctor's waiting list
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.validation(schema.addPatientRequest, "body"),
  controller.addRequest
);

// Accept/Reject a request endpoint
Router.delete(
  "/",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.validation(schema.patientRequest, "query"),
  controller.deleteRequest
);

module.exports = Router;
