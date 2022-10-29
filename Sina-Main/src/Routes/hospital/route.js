const express = require("express");

const {
  getAllHospitals,
  getHospitalsByCommune,
  getHospitalsByDaira,
  getHospitalsByWilaya,
  addNewHospital,
  modifyHospital,
  deleteHospital,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const Router = express.Router();

// hospital router
// Get all hospital list endpoint
Router.get("/", tokenAuthorization, getAllHospitals);

// Get hospital list of a commune endpoint
Router.get("/commune/:id", tokenAuthorization, getHospitalsByCommune);

// Get hospital list of a daira endpoint
Router.get("/daira/:id", tokenAuthorization, getHospitalsByDaira);

// Get hospital list of a wilaya endpoint
Router.get("/wilaya/:id", tokenAuthorization, getHospitalsByWilaya);

// Add a hospital endpoint
Router.post("/add", tokenAuthorization, addNewHospital);

// Modify a hospital endpoint
Router.post("/modify", tokenAuthorization, modifyHospital);

// Delete hospital endpoint
Router.post("/hospital/delete", tokenAuthorization, deleteHospital);

module.exports = Router;
