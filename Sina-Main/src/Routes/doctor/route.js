const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// Endpoints
// Get doctors list endpoint
Router.get(
  "/",
  middleware.validation(schema.page, "query"),
  controllers.getAllDoctors
);

// search doctor account endpoint
Router.get(
  "/search",
  middleware.validation(schema.searchDoctorQuery, "query"),
  middleware.transformQuery,
  controllers.searchDoctor
);

// get account information endpoint
Router.get(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getDoctorById
);

// update account information endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.updateDoctor, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.updateDoctor
);

// Delete account endpoint
Router.delete(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.validPassword, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.deleteDoctor
);

// Get the doctor's patient list endpoint
Router.get(
  /^\/(\d+)\/patient_list$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.doctorOnly,
  middleware.private,
  middleware.transformQuery,
  controllers.getPatientList
);

// Delete patient from the patient list endpoint
Router.delete(
  /^\/(\d+)\/patient_list\/(\d+)$/,
  middleware.parseParams,
  middleware.doctorOnly,
  middleware.private,
  controllers.deleteFromPatientList
);

// Modify doctor's password endpoint
Router.put(
  /^\/(\d+)\/password$/,
  middleware.parseParams,
  middleware.validation(schema.validNewPassword, "body"),
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyPassword
);

module.exports = Router;
