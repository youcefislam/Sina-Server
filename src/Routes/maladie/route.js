const express = require("express");
const { getMaladiesList } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// maladie route
// Modify the relative's mail Route -- need tests
Router.get("/", tokenAuthorization, getMaladiesList);

module.exports = Router;
