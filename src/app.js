const express = require("express");
var bodyParser = require("body-parser");

const medecinRouter = require("./Routes/medecin/route");
const patientRouter = require("./Routes/patient/route");
const waitingListRouter = require("./Routes/waitingList/route");
const relativeRouter = require("./Routes/relative/route");
const maladieRouter = require("./Routes/maladie/route");
const wilayaRouter = require("./Routes/wilaya/route");
const dairaRouter = require("./Routes/daira/route");
const communeRouter = require("./Routes/commune/route");
const appointmentRouter = require("./Routes/appointment/route");
const medicationRouter = require("./Routes/medication/route");
const noteRouter = require("./Routes/note/route");
const hospitalRouter = require("./Routes/hospital/route");
const medicalReportRouter = require("./Routes/medicalReport/route");
const ecgRouter = require("./Routes/Ecg/route");
const alertRouter = require("./Routes/alerts/route");

const app = express();
// Static files serving Middleware (allow access to these files publicly)
app.use("/public/views", express.static("public/views"));
app.use("/public/uploads/Media", express.static("public/uploads/Media"));
app.use("/public/views", express.static("public/views"));

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Routes
// Medecin route
app.use("/medecin", medecinRouter);

// Patient route
app.use("/patient", patientRouter);

// waiting list route
app.use("/waitinglist", waitingListRouter);

// relative route
app.use("/relative", relativeRouter);

// maladie route
app.use("/maladie", maladieRouter);

// Wilaya route
app.use("/wilaya", wilayaRouter);

// daira route
app.use("/daira", dairaRouter);

// commune route
app.use("/commune", communeRouter);

// appointment route
app.use("/appointment", appointmentRouter);

// appointment route
app.use("/medication", medicationRouter);

// note route
app.use("/note", noteRouter);

// hospital route
app.use("/hospital", hospitalRouter);

// medical report route
app.use("/medical-report", medicalReportRouter);

// ecg route
app.use("/ecg", ecgRouter);

// alert route
app.use("/alert", alertRouter);

app.use("*", (req, res) => res.sendStatus(404));

// handling unknown errors -- tested
app.use((err, req, res, next) => {
  if (err.status == 400) res.status(err.status).send({ error: "Bad_request" });
  res.status(500).send({ error: "unknown_internal_error_server" });
});

module.exports = app;
