const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// commune router
// Get the list of commune endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getCommuneList);

// add commune endpoint -- admin only (privileges to be added)
Router.post("/", middleware.tokenAuthorization, controllers.addCommune);

// update commune endpoint -- admin only (privileges to be added)
Router.put("/:id", middleware.tokenAuthorization, controllers.updateCommune);

// delete commune endpoint -- admin only (privileges to be added)
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteCommune);

// to implement later (statistics)
// -----------

module.exports = Router;
