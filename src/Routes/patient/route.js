const express = require("express");
const { modifyRelativeMail } = require("./controllers");
const { tokenAuthorization } = require("../../Middlewares/middlewares");

const Router = express.Router();

// Endpoints
// Modify the relative's mail Route -- need tests
Router.post("/relative/modify/email", tokenAuthorization, modifyRelativeMail);

module.exports = Router;
