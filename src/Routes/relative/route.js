const express = require("express");
const {
  modifyRelativeMail,
  modifyRelativeNumber,
  modifyRelativeName,
} = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// relative route == not tested yet --- previous /patient/relative/
// Modify the relative's mail Route -- need tests
Router.post("/modify/email", tokenAuthorization, modifyRelativeMail);

// Modify the relative's phone number endpoint -- need test
Router.post("/modify/number", tokenAuthorization, modifyRelativeNumber);

// Modify the relative's name endpoint -- need test
Router.post("/modify/name", tokenAuthorization, modifyRelativeName);

module.exports = Router;
