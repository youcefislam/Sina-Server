const express = require("express");
const { patientSignUp, patientResendValidation } = require("./controllers");
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

module.exports = Router;
