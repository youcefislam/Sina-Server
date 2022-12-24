const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Note router
// add a note endpoint
Router.post(
  "/",
  middleware.validation(schema.addNote, "body"),
  controllers.addNote
);

// Get a note endpoint
Router.get(/^\/(\d+)$/, middleware.parseParams, controllers.getNote);

// update a note endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.updateNote, "body"),
  controllers.updateNote
);

// Delete a note endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteNote);

// Get note list of a patient list endpoint
Router.get(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getNotesList
);

module.exports = Router;
