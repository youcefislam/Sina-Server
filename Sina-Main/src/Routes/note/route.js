const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// Note router
// Get a note endpoint
Router.post("/", middleware.tokenAuthorization, controllers.addNote);

// Get a note endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getNote);

// update a note endpoint
Router.put("/:id", middleware.tokenAuthorization, controllers.updateNote);

// Delete a note endpoint
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteNote);

// Get note list of a patient list endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  controllers.getNotesList
);

module.exports = Router;
