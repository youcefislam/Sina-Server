const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// Note router
// add a note endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.addNote, "body"),
  controllers.addNote
);

// Get a note endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.getNote
);

// update a note endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.updateNote, "body"),
  controllers.updateNote
);

// Delete a note endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.deleteNote
);

// Get note list of a patient list endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.page, "query"),
  controllers.getNotesList
);

module.exports = Router;
