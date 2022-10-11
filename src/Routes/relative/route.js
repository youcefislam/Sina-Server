const express = require("express");
const {
  modifyRelativeMail,
  modifyRelativeNumber,
  modifyRelativeName,
  addRelativeInfo,
  getRelativeInfo,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// relative route -- previous /patient/relative/
// Add patient's relative endpoint
Router.post("/add", tokenAuthorization, addRelativeInfo);

// Modify the relative's mail Route -- need tests
Router.post("/modify/email", tokenAuthorization, modifyRelativeMail);

// Modify the relative's phone number endpoint -- need test
Router.post("/modify/number", tokenAuthorization, modifyRelativeNumber);

// Modify the relative's name endpoint -- need test
Router.post("/modify/name", tokenAuthorization, modifyRelativeName);

// get relative info by id endpoint
Router.get("/:id", tokenAuthorization, getRelativeInfo);

module.exports = Router;
