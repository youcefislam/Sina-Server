const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middleware");

const Router = express.Router();

// doctor route
// sign up endpoint
Router.post("/", controllers.signUp);

// sign in endpoint
Router.post("/token", controllers.signIn);

// sign out endpoint
Router.delete(
  "/token",
  middleware.cookieTokenAuthorization,
  middleware.doctorOnly,
  controllers.signOut
);

// refresh access token endpoint
Router.post(
  "/refresh_token",
  middleware.cookieTokenAuthorization,
  middleware.doctorOnly,
  controllers.refreshAccessToken
);

// Send password restoration link endpoint
Router.post("/restore_link", controllers.sendRestoreLink);

// Send password restoration link endpoint
Router.post(
  "/reset_password",
  middleware.validationTokenAuthorization,
  controllers.resetPassword
);

// resend validate link endpoint
Router.post("/validate_account/resend", controllers.resendValidationLink);

// validate account endpoint
Router.post("/validate_account/:token", controllers.validateAccount);

module.exports = Router;
