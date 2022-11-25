const express = require("express");
const cors = require("cors");
const controllers = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const { uploadReport } = require("../../Utilities/uploadUtilities");
const Router = express.Router();

// medical report router
// get a medical report endpoint
Router.get(
  "/:id",
  tokenAuthorization,
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  controllers.getMedicalReport
);

// delete medical report endpoint
Router.delete(
  "/:id",
  tokenAuthorization,
  uploadReport.single("file"),
  controllers.deleteReport
);

// Get medical reports list endpoint
Router.get(
  "/list/:id_patient",
  tokenAuthorization,
  controllers.getMedicalReportList
);

// add new medical report endpoint
Router.post(
  "/list/:id_patient",
  tokenAuthorization,
  uploadReport.single("file"),
  controllers.addMedicalReport
);

module.exports = Router;
