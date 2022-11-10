const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// Wilaya router
// Get the list of wilaya endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getWilayaList);

// Get the list of wilaya endpoint
Router.post("/", middleware.tokenAuthorization, controllers.addWilaya);

// Get the list of wilaya endpoint
Router.put("/:id", middleware.tokenAuthorization, controllers.updateWilaya);

// Get the list of wilaya endpoint
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteWilaya);

// to implement later (statistics)
// -----------

module.exports = Router;
