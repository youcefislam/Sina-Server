const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../middlewares/middlewares");
const { schema } = require("../../utilities/validations");

const Router = express.Router();

// hospital router
// Get all hospital list endpoint
Router.get(
  "/",
  middleware.validation(schema.searchHospitalQuery, "query"),
  middleware.transformQuery,
  controllers.getAllHospitals
);

// Add hospital endpoint
Router.post(
  "/",
  middleware.validation(schema.addHospitalBody, "body"),
  controllers.addNewHospital
);

// Modify hospital endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.updateHospital, "body"),
  controllers.modifyHospital
);

// Delete hospital endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteHospital);

module.exports = Router;
