const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { uploadEcg } = require("../../Utilities/uploadUtilities");

const Router = express.Router();

// Ecg router
// Get all ecg files of patient endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  controllers.getEcgFileList
);

// Save ECG file endpoint
Router.post(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  uploadEcg.single("file"),
  controllers.addEcgFile
);

// Download ECG file endpoint
Router.get(
  "/download/:id",
  middleware.tokenAuthorization,
  controllers.downloadECGFile
);

module.exports = Router;
