const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// Daira router
// Get the list of daira endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getDairaList);

// add daira endpoint -- admin only (privileges to be added)
Router.post("/", middleware.tokenAuthorization, controllers.addDaira);

// update daira endpoint -- admin only (privileges to be added)
Router.put("/:id", middleware.tokenAuthorization, controllers.updateDaira);

// delete daira endpoint -- admin only (privileges to be added)
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteDaira);

// to implement later (statistics)
// -----------

module.exports = Router;
