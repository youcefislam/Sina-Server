const express = require("express");
const { medecinSignUp, medecinSignIn } = require("./controllers");

const Router = express.Router();

// Endpoints
// Sign up endpoint
Router.post("/signup", medecinSignUp);

// Sign in endpoint
Router.post("/signin", medecinSignIn);

module.exports = Router;
