const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const Router = express.Router();

// hospital router
// Get all hospital list endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getAllHospitals);

// Add hospital endpoint
Router.post("/", middleware.tokenAuthorization, controllers.addNewHospital);

// Modify hospital endpoint
Router.put("/:id", middleware.tokenAuthorization, controllers.modifyHospital);

// Delete hospital endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  controllers.deleteHospital
);

module.exports = Router;
