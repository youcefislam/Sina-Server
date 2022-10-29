const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middleware");

const Router = express.Router();

// patient route
// sign up endpoint
Router.post("/", controllers.signUp);

// sign in endpoint
Router.post("/token", controllers.signIn);

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
Router.post("/verify_account/", controllers.validateAccount);

// resend validate code endpoint
Router.post("/verify_account/resend", controllers.resendValidationCode);

// Send password restoration link endpoint
Router.post("/restore_link", controllers.sendRestoreLink);

// Send password restoration link endpoint
Router.post(
  "/reset_password",
  middleware.validationTokenAuthorization,
  controllers.resetPassword
);

module.exports = Router;
