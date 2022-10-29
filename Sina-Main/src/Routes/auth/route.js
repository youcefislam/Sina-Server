const express = require("express");
const {
  medecinSignUp,
  medecinSignIn,
  medecinValidateAccount,
  medecinDeleteAccount,
  medecinModifyMail,
  medecinModifyUsername,
  medecinModifyPassword,
  medecinModifyName,
  medecinModifyNumber,
  medecinModifyAutoAccept,
  medecinModifyDaira,
  medecinGetPatientList,
  medecinRemovePatient,
  getListOfDoctors,
  medecinSendRestoreLink,
  getDoctorInfoById,
  searchForDoctor,
  checkIfDoctorExist,
} = require("./controllers");
const {
  tokenAuthorization,
  medecinOnly,
  patientOnly,
  private,
} = require("../../Middlewares/middlewares");

const Router = express.Router();

// Endpoints
// Get doctor's list endpoint
Router.get("/", tokenAuthorization, getListOfDoctors);

// Sign up endpoint
Router.post("/", medecinSignUp);

// doctor existence endpoint
Router.head("/", tokenAuthorization, checkIfDoctorExist);

// Sign in endpoint
Router.post("/token", medecinSignIn);

// validate account endpoint
Router.head("/validation/validate/:token", medecinValidateAccount);

// // resend validate link endpoint
// Router.head("/validation/validate/:token", medecinValidateAccount);

// Send password restoration link endpoint
Router.post("/restorelink", medecinSendRestoreLink);

// search account by username endpoint
Router.get("/search", searchForDoctor);

// get account endpoint
Router.get("/:id", tokenAuthorization, getDoctorInfoById);

// Delete account endpoint
Router.delete(
  "/:id",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinDeleteAccount
);

// Get the doctor's patient list endpoint
Router.get(
  "/:id/patientlist",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinGetPatientList
);

// Delete patient from the patient list endpoint
Router.delete(
  "/:id/patientlist/:id_patient",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinRemovePatient
);

// Modify doctor's mail endpoint
Router.put(
  "/:id/mail",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyMail
);

// Modify doctor's username endpoint
Router.put(
  "/:id/username",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyUsername
);

// Modify doctor's password endpoint
Router.put(
  "/:id/password",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyPassword
);

// Modify doctor's first and last name endpoint
Router.put(
  "/:id/name",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyName
);

// Modify doctor's phone number endpoint
Router.put(
  "/:id/phone_number",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyNumber
);

// Modify doctor's auto accept endpoint
Router.put(
  "/:id/accept-method",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyAutoAccept
);

// Modify doctor's daira endpoint
Router.put(
  "/:id/daira",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyDaira
);

module.exports = Router;
