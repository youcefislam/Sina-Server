const express = require("express");
const cors = require("cors");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { uploadReport } = require("../../utilities/uploadUtilities");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// medical report router
// get a medical report endpoint
Router.get(
  /^\/(\d+)$/,
  middleware.parseParams,
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  controllers.getMedicalReport
);

// delete medical report endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteReport);

// Get medical reports list endpoint
Router.get(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.getReportOptions, "query"),
  middleware.transformQuery,
  controllers.getMedicalReportList
);

// add new medical report endpoint
Router.post(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  uploadReport.single("file"),
  controllers.addMedicalReport
);

module.exports = Router;
