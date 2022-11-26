const express = require("express");

const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// drugs router
// Get drugs list endpoint
Router.get(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.page, "query"),
  controllers.getAllDrugs
);

// Add a new drug endpoint
Router.post(
  "/",
  middleware.tokenAuthorization,
  middleware.validation(schema.addNewDrug, "body"),
  controllers.addNewDrug
);

// Get drug information endpoint
Router.get(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.getDrugInfo
);

// Update a drug endpoint
Router.put(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  middleware.validation(schema.updateDrug, "body"),
  controllers.updateDrug
);

// Delete a drug endpoint
Router.delete(
  "/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.validId, "params"),
  controllers.deleteDrug
);

// Get the drugs list of a patient endpoint
Router.get(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.page, "query"),
  controllers.getPatientDrugsList
);

// Add a drug to the list of drugs for a patient endpoint
Router.post(
  "/list/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.validIdDrug, "body"),
  controllers.addToDrugsList
);

// Delete a drug from the patient's drugs list endpoint
Router.delete(
  "/list/:id_patient/:id_drug",
  middleware.tokenAuthorization,
  middleware.validation(schema.drugListItem, "params"),
  controllers.deleteFromDugList
);

// Get the drug's journal of a patient endpoint
Router.get(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.page, "query"),
  controllers.getDrugsJournal
);

// Take a dose of a drug endpoint
Router.post(
  "/journal/:id_patient",
  middleware.tokenAuthorization,
  middleware.validation(schema.validIdPatient, "params"),
  middleware.validation(schema.validIdDrug, "body"),
  controllers.addToDrugsJournal
);

// Get a specific drug's journal of a patient endpoint
Router.get(
  "/journal/:id_patient/:id_drug",
  middleware.tokenAuthorization,
  middleware.validation(schema.drugListItem, "params"),
  controllers.getOneDrugJournal
);

// Delete a patient's drug journal record endpoint
Router.delete(
  "/journal/:id_patient/:id_drug/:id",
  middleware.tokenAuthorization,
  middleware.validation(schema.deleteFromDrugJournal, "params"),
  controllers.deleteDrugFromJournal
);

// statistics to be added later

module.exports = Router;
