const express = require("express");
const controller = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// Waiting list route
// Get the waiting list of the doctor endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controller.getWaitingList
);

// Insert a patient request to the doctor's waiting list
Router.post(
  "/:id",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  controller.addRequest
);

// Reject a patient on waiting list endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controller.rejectRequest
);

// Accept a patient request endpoint
Router.post(
  "/:id/accept",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controller.acceptRequest
);

module.exports = Router;
