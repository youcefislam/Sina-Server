const express = require("express");
const cors = require("cors");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { uploadReport } = require("../../Utilities/uploadUtilities");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// medical report router
// get a medical report endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  controllers.getMedicalReport
);

// delete medical report endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.deleteReport
);

// Get medical reports list endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.getReportOptions, "query"),
  middleware.transformQuery,
  controllers.getMedicalReportList
);

// add new medical report endpoint
Router.post(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  uploadReport.single("file"),
  controllers.addMedicalReport
);

module.exports = Router;
