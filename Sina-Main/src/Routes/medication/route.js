const express = require("express");

const {
  getMedicationOfPatient,
  addMedicationToList,
  modifyMedicationOnList,
  deleteMedicationFromList,
  getAllMedication,
  addNewMedication,
  modifyMedication,
  deleteMedication,
  addMedicationToJournal,
  endMedicationJournal,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// medication router
// Notes:
// 1- all in all need more verification to see if request came from patient/doctor
// 2- need more verification to check if the patient correspond to the doctor who made the request
// Get all medications list endpoint
Router.get("/", tokenAuthorization, getAllMedication);

// Get the medication list of a patient endpoint
Router.get("/:id", tokenAuthorization, getMedicationOfPatient);

// Add a medication to the list of medication for a patient endpoint
Router.post("/:id/add", tokenAuthorization, addMedicationToList);

// Modify the dosage of a medication in the list of medication for a patient endpoint
Router.post("/:id/modify", tokenAuthorization, modifyMedicationOnList);

// Delete a medication from the list of a patient endpoint
Router.post("/:id/delete", tokenAuthorization, deleteMedicationFromList);

// Add a new medication endpoint
Router.post("/add", tokenAuthorization, addNewMedication);

// Modify the name of a medication endpoint
Router.post("/modify/:id", tokenAuthorization, modifyMedication);

// Delete a medication endpoint
Router.post("/delete/:id", tokenAuthorization, deleteMedication);

// take a dose of a medic endpoint
Router.post("/journal/dose", tokenAuthorization, addMedicationToJournal);

// Patient end his medication endpoint
Router.post("/journal/end", tokenAuthorization, endMedicationJournal);

module.exports = Router;
