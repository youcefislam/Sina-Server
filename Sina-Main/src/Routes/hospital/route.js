const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");
const Router = express.Router();

// hospital router
// Get all hospital list endpoint
Router.get(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.searchHospitalQuery, "query"),
  controllers.getAllHospitals
);

// Add hospital endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.addHospitalBody, "body"),
  controllers.addNewHospital
);

// Modify hospital endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.updateHospital, "body"),
  controllers.modifyHospital
);

// Delete hospital endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.deleteHospital
);

module.exports = Router;
