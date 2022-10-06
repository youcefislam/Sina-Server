const express = require("express");
const {
  getWaitingList,
  addPatientRequest,
  acceptPatientRequest,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// Waiting list route == not tested yet --- previous /medecin/waitinglist/
// Get the waiting list of the doctor endpoint
Router.get("/", tokenAuthorization, getWaitingList);

// Insert a patient request to the doctor's waiting list --- previous /medecin/waitinglist/add
Router.post("/request", tokenAuthorization, addPatientRequest);

// Accept a patient request endpoint
Router.post("/accept", tokenAuthorization, acceptPatientRequest);

module.exports = Router;
