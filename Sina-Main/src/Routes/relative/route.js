const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// relative route
// get relative info by patient id endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getRelativeInfo);

// Add patient's relative endpoint
Router.post(
  "/:id",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.addRelative
);

// delete patient's relative endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.deleteRelative
);

// Modify the relative's mail endpoint
Router.put(
  "/:id/mail",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyMail
);

// Modify the relative's phone number endpoint
Router.put(
  "/:id/phone_number",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyNumber
);

// Modify the relative's name endpoint
Router.put(
  "/:id/name",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyName
);

module.exports = Router;
