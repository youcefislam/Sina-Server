const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// Wilaya router
// Get the list of wilaya endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getWilayaList);

// add wilaya endpoint -- admin only (privileges to be added)
Router.post("/", middleware.tokenAuthorization, controllers.addWilaya);

// Get the wilaya's info endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getWilaya);

// update wilaya endpoint -- admin only (privileges to be added)
Router.put("/:id", middleware.tokenAuthorization, controllers.updateWilaya);

// delete wilaya endpoint -- admin only (privileges to be added)
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteWilaya);

// to implement later (statistics)
// -----------

module.exports = Router;
