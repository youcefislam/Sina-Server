const express = require("express");

const {
  getAllNotesOfPatient,
  addNoteToPatient,
  modifyNotePatient,
  deleteNotePatient,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// Note router
// Get note list of a patient list endpoint
Router.get("/list/:id", tokenAuthorization, getAllNotesOfPatient);

// Add a note to a patient endpoint
Router.post("/list/:id/add", tokenAuthorization, addNoteToPatient);

// Modify a patient note endpoint
Router.post("/modify", tokenAuthorization, modifyNotePatient);

// Delete a patient note endpoint
Router.post("/delete", tokenAuthorization, deleteNotePatient);

module.exports = Router;
