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
  medecinResetPassword,
  getDoctorInfoById,
  medecinGetMyInfo,
  medecinGetMail,
  medecinGetUsername,
  medecinGetName,
  medecinGetNumber,
  medecinGetAutoAccept,
  medecinGetDaira,
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

// medecin is real medecins
Router.head("/", tokenAuthorization, (req, res) => res.end());

// Sign in endpoint
Router.post("/token", medecinSignIn);

// validate account endpoint
Router.head("/validation/:token", medecinValidateAccount);

// Send password restoration link endpoint
Router.post("/restorelink", medecinSendRestoreLink);

// Delete account endpoint
Router.get("/:id", tokenAuthorization, medecinOnly, getDoctorInfoById);

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
  "/:id/patientlist/:idPatient",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinRemovePatient
);

// Get doctor's mail endpoint
Router.get("/:id/mail", tokenAuthorization, medecinGetMail);

// Modify doctor's mail endpoint
Router.put(
  "/:id/mail",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyMail
);

// Get doctor's username endpoint
Router.get("/:id/username", tokenAuthorization, medecinGetUsername);

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

// Get doctor's first and last name endpoint
Router.get("/:id/name", tokenAuthorization, medecinGetName);

// Modify doctor's first and last name endpoint
Router.put(
  "/:id/name",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyName
);

// Get doctor's phone number endpoint
Router.get("/:id/number", tokenAuthorization, medecinGetNumber);

// Modify doctor's phone number endpoint
Router.put(
  "/:id/number",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyNumber
);

// Get doctor's auto accept endpoint
Router.get(
  "/:id/accept-method",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinGetAutoAccept
);

// Modify doctor's auto accept endpoint
Router.put(
  "/:id/accept-method",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyAutoAccept
);

// Get doctor's daira endpoint
Router.get("/:id/daira", tokenAuthorization, medecinGetDaira);

// Modify doctor's daira endpoint
Router.put(
  "/:id/daira",
  tokenAuthorization,
  medecinOnly,
  private,
  medecinModifyDaira
);

// // ================================================ need to split this into multiple requests
// // doctor get his info endpoint
// Router.get("/my-info", tokenAuthorization, medecinGetMyInfo);

module.exports = Router;
