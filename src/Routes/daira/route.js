const express = require("express");

const { getDairaList } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// Daira router
// Get the list of daira endpoint
Router.get("/", tokenAuthorization, getDairaList);

module.exports = Router;
