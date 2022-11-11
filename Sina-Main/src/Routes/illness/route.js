const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// illness route
// Get illness list endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getIllnessList);

// Add a type of illness endpoint
Router.post("/", middleware.tokenAuthorization, controllers.addIllness);

// Get a type of illness endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getIllness);

// Update a type of illness endpoint
Router.put("/:id", middleware.tokenAuthorization, controllers.updateIllness);

// Delete a type of illness endpoint
Router.delete("/:id", middleware.tokenAuthorization, controllers.deleteIllness);

module.exports = Router;
