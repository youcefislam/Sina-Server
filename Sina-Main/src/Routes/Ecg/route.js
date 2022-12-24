const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { uploadEcg } = require("../../utilities/uploadUtilities");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Ecg router
// Get all ecg files of patient endpoint
Router.get(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.getEcgListOptions, "query"),
  middleware.transformQuery,
  controllers.getEcgFileList
);

// Save ECG file endpoint
Router.post(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  uploadEcg.single("file"),
  middleware.validation(schema.addEcgFile, "body"),
  controllers.addEcgFile
);

// Download ECG file endpoint
Router.get(
  /^\/download\/(\d+)$/,
  middleware.parseParams,
  controllers.downloadECGFile
);

module.exports = Router;
