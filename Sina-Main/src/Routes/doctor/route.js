const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// Endpoints
// Get doctor's list endpoint
Router.get(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.page, "query"),
  controllers.getAllDoctors
);

// search doctor account endpoint
Router.get(
  "/search",
  middleware.validation(schema.searchDoctorQuery, "query"),
  controllers.searchDoctor
);

// get account endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.getDoctorById
);

// update account endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.updateDoctor, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.updateDoctor
);

// Delete account endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.validPassword, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.deleteDoctor
);

// Get the doctor's patient list endpoint
Router.get(
  "/:id/patient_list",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.page, "query"),
  middleware.doctorOnly,
  middleware.private,
  controllers.getPatientList
);

// Delete patient from the patient list endpoint
Router.delete(
  "/:id/patient_list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.deleteFromPatientList, "params"),
  middleware.doctorOnly,
  middleware.private,
  controllers.deleteFromPatientList
);

// Modify doctor's password endpoint
Router.put(
  "/:id/password",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.validNewPassword, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyPassword
);

module.exports = Router;
