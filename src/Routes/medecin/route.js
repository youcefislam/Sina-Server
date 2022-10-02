const express = require("express");
const { medecinSignUp } = require("./controllers");

const Router = express.Router();

// Endpoints
// Sign up Route for doctors
Router.post("/signup", medecinSignUp);

module.exports = Router;
