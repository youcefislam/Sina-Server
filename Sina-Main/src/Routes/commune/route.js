const express = require("express");

const { getCommuneList } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// Commune router
// Get the list of commune endpoint
Router.get("/", tokenAuthorization, getCommuneList);

module.exports = Router;
