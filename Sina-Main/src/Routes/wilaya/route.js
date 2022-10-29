const express = require("express");

const { getWilayaList } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// Wilaya router
// Get the list of wilaya endpoint
Router.get("/", tokenAuthorization, getWilayaList);

module.exports = Router;
