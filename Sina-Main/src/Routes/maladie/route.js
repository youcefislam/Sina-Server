const express = require("express");
const { getMaladiesList, addMaladie } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// maladie route
// Get diseases list endpoint
Router.get("/", tokenAuthorization, getMaladiesList);

// Add a type of disease endpoint
Router.post("/add", tokenAuthorization, addMaladie);

module.exports = Router;
