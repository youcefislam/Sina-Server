const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// Endpoints
// Get doctor's list endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getAllDoctors);

// search account by username endpoint
Router.get("/search", controllers.searchDoctor);

// get account endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getDoctorById);

// Delete account endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.deleteDoctor
);

// Get the doctor's patient list endpoint
Router.get(
  "/:id/patient_list",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.getPatientList
);

// Delete patient from the patient list endpoint
Router.delete(
  "/:id/patient_list/:id_patient",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.removeFromPatientList
);

// Modify doctor's mail endpoint
Router.put(
  "/:id/mail",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyMail
);

// Modify doctor's username endpoint
Router.put(
  "/:id/username",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyUsername
);

// Modify doctor's password endpoint
Router.put(
  "/:id/password",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyPassword
);

// Modify doctor's first and last name endpoint
Router.put(
  "/:id/name",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyName
);

// Modify doctor's phone number endpoint
Router.put(
  "/:id/phone_number",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyNumber
);

// Modify doctor's auto accept endpoint
Router.put(
  "/:id/accept-method",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyAutoAccept
);

// Modify doctor's daira endpoint
Router.put(
  "/:id/address",
  middleware.tokenAuthorization,
  middleware.doctorOnly,
  middleware.private,
  controllers.modifyAddress
);

module.exports = Router;
