const express = require("express");
const cors = require("cors");
const { addEcgFile, getEcgFile } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");
const { uploadEcg } = require("../../Utilities/uploadUtilities");
const Router = express.Router();

// Ecg router
//Post an ECG file endpoint
Router.post("/add", tokenAuthorization, uploadEcg.single("file"), addEcgFile);

// Get an ECG file endpoint
Router.get("/download/:id", tokenAuthorization, getEcgFile);

// get all ecg files of patient endpoint

// delete ecg file  endpoint

module.exports = Router;
