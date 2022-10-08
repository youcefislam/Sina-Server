const express = require("express");
const {
  patientSignUp,
  patientResendValidation,
  patientAddInfo,
  patientDeleteAccount,
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

// Add patient's information and adress Route -- tested
Router.post("/information/add", tokenAuthorization, patientAddInfo);

// Delete patient account Route -- tested
Router.post("/delete", tokenAuthorization, patientDeleteAccount);

module.exports = Router;
