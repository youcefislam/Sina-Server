const jwt = require("jsonwebtoken");
require("dotenv").config();

const { validateToken } = require("../Utilities/utility");

const tokenAuthorization = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    req.token = bearerHeader.split(" ")[1];
    const { error, valid } = await validateToken(req.token);
    if (error) res.status(401).send({ error: "invalid_token" });
    else {
      req.autData = valid;
      next();
    }
  } else res.status(401).send({ error: "token_missing" });
};

module.exports = {
  tokenAuthorization,
};
