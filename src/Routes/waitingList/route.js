const express = require("express");
const { getWaitingList, addPatientRequest } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// Get the waiting list of the doctor endpoint
Router.get("/", tokenAuthorization, getWaitingList);

// Insert a patient request to the doctor's waiting list --- previous /medecin/waitinglist/add
Router.post("/request", tokenAuthorization, addPatientRequest);

module.exports = Router;
