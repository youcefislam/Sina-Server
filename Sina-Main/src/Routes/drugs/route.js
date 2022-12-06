const express = require("express");
const controllers = require("./controllers");
const middleware = require("../../Middlewares/middlewares");
const { schema } = require("../../Utilities/validations");

const Router = express.Router();

// drugs router
// Get drugs list endpoint
Router.get(
  "/",
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getAllDrugs
);

// Add a new drug endpoint
Router.post(
  "/",
  middleware.validation(schema.addNewDrug, "body"),
  controllers.addNewDrug
);

// Get drug information endpoint
Router.get(/^\/(\d+)$/, middleware.parseParams, controllers.getDrugInfo);

// Update a drug endpoint
Router.put(
  /^\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.updateDrug, "body"),
  controllers.updateDrug
);

// Delete a drug endpoint
Router.delete(/^\/(\d+)$/, middleware.parseParams, controllers.deleteDrug);

// Get the drugs list of a patient endpoint
Router.get(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getPatientDrugsList
);

// Add a drug to the list of drugs for a patient endpoint
Router.post(
  /^\/list\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.validIdDrug, "body"),
  controllers.addToDrugsList
);

// Delete a drug from the patient's drugs list endpoint
Router.delete(
  /^\/list\/(\d+)\/(\d+)$/,
  middleware.parseParams,
  controllers.deleteFromDugList
);

// Get the drug's journal of a patient endpoint
Router.get(
  /^\/journal\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.pagination, "query"),
  middleware.transformQuery,
  controllers.getDrugsJournal
);

// Take a dose of a drug endpoint
Router.post(
  /^\/journal\/(\d+)$/,
  middleware.parseParams,
  middleware.validation(schema.validIdDrug, "body"),
  controllers.addToDrugsJournal
);

// Get a specific drug's journal of a patient endpoint
Router.get(
  /^\/journal\/(\d+)\/(\d+)$/,
  middleware.parseParams,
  controllers.getOneDrugJournal
);

// Delete a patient's drug journal record endpoint
Router.delete(
  /^\/journal\/(\d+)\/(\d+)\/(\d+)$/,
  middleware.parseParams,
  controllers.deleteDrugFromJournal
);

module.exports = Router;
