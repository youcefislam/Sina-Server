const express = require("express");
const cors = require("cors");
const { addMedicalReport, getMedicalReport } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const { uploadReport, uploadEcg } = require("../../Utilities/uploadUtilities");
const Router = express.Router();

// medical report router
// receive a new medical report file endpoint
Router.post(
  "/add",
  tokenAuthorization,
  uploadReport.single("file"),
  addMedicalReport
);

// Get a report file endpoint
Router.get(
  "/download/:id",
  tokenAuthorization,
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  getMedicalReport
);

// delete medical report file endpoint

module.exports = Router;
