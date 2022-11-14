const express = require("express");

const controllers = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// drugs router
// Get drugs list endpoint
Router.get("/", tokenAuthorization, controllers.getAllDrugs);

// Add a new drug endpoint
Router.post("/", tokenAuthorization, controllers.addNewDrug);

// Get drug information endpoint
Router.get("/:id", tokenAuthorization, controllers.getDrugInfo);

// Update a drug endpoint
Router.put("/:id", tokenAuthorization, controllers.updateDrug);

// Delete a drug endpoint
Router.delete("/:id", tokenAuthorization, controllers.deleteDrug);

// Get the drugs list of a patient endpoint
Router.get(
  "/list/:id_patient",
  tokenAuthorization,
  controllers.getPatientDrugsList
);

// Add a drug to the list of drugs for a patient endpoint
Router.post(
  "/list/:id_patient",
  tokenAuthorization,
  controllers.addToDrugsList
);

// Delete a drug from the patient's drugs list endpoint
Router.delete(
  "/list/:id_patient/:id_drug",
  tokenAuthorization,
  controllers.deleteFromDugList
);

// Get the drug's journal of a patient endpoint
Router.get(
  "/journal/:id_patient",
  tokenAuthorization,
  controllers.getDrugsJournal
);

// Take a dose of a drug endpoint
Router.post(
  "/journal/:id_patient",
  tokenAuthorization,
  controllers.addToDrugsJournal
);

// Get a specific drug's journal of a patient endpoint
Router.get(
  "/journal/:id_patient/:id_drug",
  tokenAuthorization,
  controllers.getOneDrugJournal
);

// Delete a patient's drug journal record endpoint
Router.delete(
  "/journal/:id_patient/:id_drug/:id",
  tokenAuthorization,
  controllers.deleteDrugFromJournal
);

// statistics to be added later

module.exports = Router;
