const express = require("express");
const {
  patientSignUp,
  patientResendValidation,
  patientAddInfo,
  patientDeleteAccount,
  patientSendRestoreLink,
  patientResetPassword,
  patientSignIn,
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

module.exports = Router;
