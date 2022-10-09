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

// Modify patient's mail end point --- need to add email validation also
Router.post("/modifyMail", tokenAuthorization, patientModifyMail);

// Modify patient's username Route -- tested
Router.post("/modifyUsername", tokenAuthorization, patientModifyUsername);

// Modify patient's password Route -- tested
Router.post("/modifyPassword", tokenAuthorization, patientModifyPassword);

// Modify patient's first and last name Route -- tested
Router.post("/modifyName", tokenAuthorization, patientModifyName);

// Modify patient's phone number Route -- tested
Router.post("/modifyNumber", tokenAuthorization, patientModifyNumber);

// Modify patient's adress Route -- tested
Router.post("/modifyadress", tokenAuthorization, patientModifyAddress);

module.exports = Router;
