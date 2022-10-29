const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookie_parser = require("cookie-parser");

require("dotenv").config();

const patientAuthRoute = require("./Routes/patient/route");
const doctorAuthRoute = require("./Routes/doctor/route");

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("trust-proxy", true);

app.use(cookie_parser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

app.use("/patient", patientAuthRoute);
app.use("/doctor", doctorAuthRoute);

app.use("*", (req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  if (err.status == 400) return res.sendStatus(err.status);
  res.sendStatus(500);
});

module.exports = app;
