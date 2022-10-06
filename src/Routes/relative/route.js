const express = require("express");
const { modifyRelativeMail, modifyRelativeNumber } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// relative route == not tested yet --- previous /patient/relative/
// Modify the relative's mail Route -- need tests
Router.post("/modify/email", tokenAuthorization, modifyRelativeMail);

// Modify the relative's phone number Route -- tested
Router.post("/modify/number", tokenAuthorization, modifyRelativeNumber);

module.exports = Router;
