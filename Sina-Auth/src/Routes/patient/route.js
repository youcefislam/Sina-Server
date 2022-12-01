const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middleware");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// patient route
// sign up endpoint
Router.post(
  "/",
  middleware.validation(schema.patientSignUp, "body"),
  controllers.signUp
);

// sign in endpoint
Router.post(
  "/token",
  middleware.validation(schema.signIn, "body"),
  controllers.signIn
);

// sign out endpoint
Router.delete(
  "/token",
  middleware.headerTokenAuthorization,
  middleware.patientOnly,
  controllers.signOut
);

// refresh access token endpoint
Router.post(
  "/refresh_token",
  middleware.headerTokenAuthorization,
  middleware.patientOnly,
  controllers.refreshAccessToken
);

// validate account endpoint
Router.post(
  "/verify_account/",
  middleware.validation(schema.validValidationCode, "body"),
  controllers.validateAccount
);

// resend validation code endpoint
Router.post(
  "/verify_account/resend",
  middleware.validation(schema.validMail, "body"),
  controllers.resendValidationCode
);

// Send password restoration link endpoint
Router.post(
  "/restore_link",
  middleware.validation(schema.validMail, "body"),
  controllers.sendRestoreLink
);

// reset password link endpoint
Router.post(
  "/reset_password",
  middleware.validation(schema.validToken, "query"),
  middleware.validation(schema.validNewPassword, "body"),
  controllers.resetPassword
);

module.exports = Router;
