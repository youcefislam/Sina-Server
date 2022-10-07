const express = require("express");
const { patientSignUp } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// patient router
// Patient sign up endpoint
Router.post("/signUp", patientSignUp);

module.exports = Router;
