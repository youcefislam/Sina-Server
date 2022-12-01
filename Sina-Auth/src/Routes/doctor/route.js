const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middleware");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// doctor route
// sign up endpoint
Router.post(
  "/",
  middleware.validation(schema.doctorSignUp, "body"),
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
Router.post(
  "/restore_link",
  middleware.validation(schema.validMail, "body"),
  controllers.sendRestoreLink
);

// reset password  endpoint
Router.post(
  "/reset_password",
  middleware.validation(schema.validToken, "query"),
  middleware.validation(schema.validNewPassword, "body"),
  controllers.resetPassword
);

// resend validate link endpoint
Router.post(
  "/validate_account/resend",
  middleware.validation(schema.validMail, "body"),
  controllers.resendValidationLink
);

// validate account endpoint
Router.post(
  "/validate_account/",
  middleware.validation(schema.validToken, "query"),
  controllers.validateAccount
);

module.exports = Router;
