const express = require("express");
const {
  medecinSignUp,
  medecinSignIn,
  medecinValidateAccount,
  medecinDeleteAccount,
  medecinModifyMail,
  medecinModifyUsername,
  medecinModifyPassword,
  medecinModifyName,
  medecinModifyNumber,
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

// Modify doctor's username endpoint
Router.post("/modifyUsername", tokenAuthorization, medecinModifyUsername);

// Modify doctor's password endpoint
Router.post("/modifyPassword", tokenAuthorization, medecinModifyPassword);

// Modify doctor's first and last name endpoint
Router.post("/modifyName", tokenAuthorization, medecinModifyName);

// Modify doctor's phone number endpoint
Router.post("/modifyNumber", tokenAuthorization, medecinModifyNumber);

module.exports = Router;
