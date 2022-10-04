const express = require("express");
const {
  medecinSignUp,
  medecinSignIn,
  medecinValidateAccount,
} = require("./controllers");

const Router = express.Router();

// Endpoints
// Sign up endpoint
Router.post("/signup", medecinSignUp);

// Sign in endpoint
Router.post("/signin", medecinSignIn);

// Sign in endpoint
Router.get("/confirmation/:token", medecinValidateAccount);

module.exports = Router;
