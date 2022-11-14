const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");

const Router = express.Router();

// patient router
// patient get patient info endpoint
Router.get("/", middleware.tokenAuthorization, controllers.getAllPatient);

// patient get patient info endpoint
Router.get("/:id", middleware.tokenAuthorization, controllers.getPatientInfo);

// Add patient's information endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.addInfo
);

// Delete patient account endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.deleteAccount
);

// Modify patient's mail endpoint
Router.put(
  "/:id/mail",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyMail
);

// Modify patient's username endpoint
Router.put(
  "/:id/username",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyUsername
);

// Modify patient's password endpoint
Router.put(
  "/:id/password",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyPassword
);

// Modify patient's first and last name endpoint
Router.put(
  "/:id/name",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyName
);

// Modify patient's phone number endpoint
Router.put(
  "/:id/phone_number",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyNumber
);

// Modify patient's address endpoint
Router.put(
  "/:id/address",
  middleware.tokenAuthorization,
  middleware.patientOnly,
  middleware.private,
  controllers.modifyAddress
);

module.exports = Router;
