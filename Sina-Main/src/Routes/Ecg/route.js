const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { uploadEcg } = require("../../Utilities/uploadUtilities");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// Ecg router
// Get all ecg files of patient endpoint
Router.get(
  "/list/:id_patient",
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.getEcgListOptions, "query"),
  middleware.transformQuery,
  controllers.getEcgFileList
);

// Save ECG file endpoint
Router.post(
  "/list/:id_patient",
  middleware.validation(schema.validIdPatient, "params"),
  uploadEcg.single("file"),
  middleware.validation(schema.addEcgFile, "body"),
  controllers.addEcgFile
);

// Download ECG file endpoint
Router.get(
  "/download/:id",
  middleware.validation(schema.validId, "params"),
  controllers.downloadECGFile
);

module.exports = Router;
