const express = require("express");
const {
  medecinSignUp,
  medecinSignIn,
  medecinValidateAccount,
  medecinDeleteAccount,
  medecinModifyMail,
  medecinModifyUsername,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// Endpoints
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

// Modify doctor's username Route -- tested
Router.post("/modifyUsername", tokenAuthorization, medecinModifyUsername);

module.exports = Router;
