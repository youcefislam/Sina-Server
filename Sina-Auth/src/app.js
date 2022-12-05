const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  cookie_parser = require("cookie-parser");

require("dotenv").config();

const patientAuthRoute = require("./Routes/patient/route"),
  doctorAuthRoute = require("./Routes/doctor/route");

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
  if (error.code == "duplicated_entry_error")
    return res.status(400).send(error);
  if (error.name == "JsonWebTokenError" || error.name == "TokenExpiredError")
    return res.status(400).send({
      code: "invalid_link",
      message: "Link expired or not valid anymore",
    });
  res.sendStatus(500);
});

module.exports = app;
