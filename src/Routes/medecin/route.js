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
const { tokenAuthorization } = require("../../Middlewares/middlewares");

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

// Get the doctor's patient list endpoint
Router.get("/patientlist", tokenAuthorization, medecinGetPatientList);

// Send restore doctor password link endpoint
Router.post("/restorelink", medecinSendRestoreLink);

// Delete account endpoint
Router.get("/:id", tokenAuthorization, getDoctorInfoById);

// Delete account endpoint
Router.delete("/:id", tokenAuthorization, medecinDeleteAccount);

// Get doctor's mail endpoint
Router.get("/:id/mail", tokenAuthorization, medecinGetMail);

// Modify doctor's mail endpoint
Router.put("/:id/mail", tokenAuthorization, medecinModifyMail);

// Get doctor's username endpoint
Router.get("/:id/username", tokenAuthorization, medecinGetUsername);

// Modify doctor's username endpoint
Router.put("/:id/username", tokenAuthorization, medecinModifyUsername);

// Modify doctor's password endpoint
Router.put("/:id/password", tokenAuthorization, medecinModifyPassword);

// Modify doctor's first and last name endpoint
Router.get("/:id/name", tokenAuthorization, medecinGetName);

// Modify doctor's first and last name endpoint
Router.put("/:id/name", tokenAuthorization, medecinModifyName);

// Modify doctor's phone number endpoint
Router.get("/:id/number", tokenAuthorization, medecinGetNumber);

// Modify doctor's phone number endpoint
Router.put("/:id/number", tokenAuthorization, medecinModifyNumber);

// Modify doctor's auto accept endpoint
Router.get("/:id/accept-method", tokenAuthorization, medecinGetAutoAccept);

// Modify doctor's auto accept endpoint
Router.put("/:id/accept-method", tokenAuthorization, medecinModifyAutoAccept);

// Modify doctor's daira endpoint
Router.get("/:id/daira", tokenAuthorization, medecinGetDaira);

// Modify doctor's daira endpoint
Router.put("/:id/daira", tokenAuthorization, medecinModifyDaira);

// Delete patient from the patient list endpoint
Router.delete("/patientlist/:id", tokenAuthorization, medecinRemovePatient);

// // ================================================ need to split this into multiple requests
// // doctor get his info endpoint
// Router.get("/my-info", tokenAuthorization, medecinGetMyInfo);

module.exports = Router;
