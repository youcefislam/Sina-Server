const express = require("express");
const {
  patientSignUp,
  patientResendValidation,
  patientAddInfo,
  patientDeleteAccount,
  patientSendRestoreLink,
  patientResetPassword,
  patientSignIn,
  patientModifyMail,
  patientModifyUsername,
  patientModifyPassword,
  patientModifyName,
  patientModifyNumber,
  patientModifyAddress,
  getPatientInfo,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// patient router
// Patient sign up endpoint
Router.post("/signUp", patientSignUp);

// Resend validation code to patient Route -- tested
Router.get(
  "/signup/resendValidation",
  tokenAuthorization,
  patientResendValidation
);

// Add patient's information and adress endpoint
Router.post("/information/add", tokenAuthorization, patientAddInfo);

// Delete patient account endpoint
Router.post("/delete", tokenAuthorization, patientDeleteAccount);

// Send reset patient's password link endpoint
Router.get("/resetlink", patientSendRestoreLink);

// reset password patient endpoint
Router.post("/resetpassword", tokenAuthorization, patientResetPassword);

// sign in patient endpoint
Router.post("/signin", patientSignIn);

// Modify patient's mail endpoint --- need to add email validation also
Router.post("/modifyMail", tokenAuthorization, patientModifyMail);

// Modify patient's username endpoint
Router.post("/modifyUsername", tokenAuthorization, patientModifyUsername);

// Modify patient's password endpoint
Router.post("/modifyPassword", tokenAuthorization, patientModifyPassword);

// Modify patient's first and last name endpoint
Router.post("/modifyName", tokenAuthorization, patientModifyName);

// Modify patient's phone number endpoint
Router.post("/modifyNumber", tokenAuthorization, patientModifyNumber);

// Modify patient's adress endpoint
Router.post("/modifyadress", tokenAuthorization, patientModifyAddress);

// Get patient profile endpoint
Router.get("/:id", tokenAuthorization, getPatientInfo);

module.exports = Router;
