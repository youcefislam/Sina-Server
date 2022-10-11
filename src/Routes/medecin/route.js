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
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// Endpoints
// Get doctor's list endpoint
Router.get("/", tokenAuthorization, getListOfDoctors);

// Sign up endpoint
Router.post("/signup", medecinSignUp);

// Sign in endpoint
Router.post("/signin", medecinSignIn);

// Sign in endpoint
Router.get("/confirmation/:token", medecinValidateAccount);

// Delete account endpoint
Router.post("/delete", tokenAuthorization, medecinDeleteAccount);

// Modify doctor's mail endpoint
Router.post("/modifyMail", tokenAuthorization, medecinModifyMail);

// Modify doctor's username endpoint
Router.post("/modifyUsername", tokenAuthorization, medecinModifyUsername);

// Modify doctor's password endpoint
Router.post("/modifyPassword", tokenAuthorization, medecinModifyPassword);

// Modify doctor's first and last name endpoint
Router.post("/modifyName", tokenAuthorization, medecinModifyName);

// Modify doctor's phone number endpoint
Router.post("/modifyNumber", tokenAuthorization, medecinModifyNumber);

// Modify doctor's auto accept endpoint
Router.post("/modifyAccept", tokenAuthorization, medecinModifyAutoAccept);

// Modify doctor's daira endpoint
Router.post("/modifyDaira", tokenAuthorization, medecinModifyDaira);

// Get the doctor's patient list endpoint
Router.get("/patientlist", tokenAuthorization, medecinGetPatientList);

// Delete patient from the patient list endpoint
Router.post("/patientlist/remove", tokenAuthorization, medecinRemovePatient);

// Send restore doctor password link endpoint
Router.get("/restorelink", medecinSendRestoreLink);

// reset password medecin endpoint
Router.post("/resetpassword", tokenAuthorization, medecinResetPassword);

// doctor get his info endpoint
Router.get("/my-info", tokenAuthorization, medecinGetMyInfo);

// get doctor's info by id endpoint
Router.get("/:id", tokenAuthorization, getDoctorInfoById);

module.exports = Router;
