const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  cookie_parser = require("cookie-parser");

const apiRouter = require("./apiRouter");

require("dotenv").config();

const app = express();

app.use(cors());

app.set("trust-proxy", true);

app.use(cookie_parser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

app.use("/api/v2", apiRouter);

app.use((req, res) => res.sendStatus(404));

module.exports = app;
