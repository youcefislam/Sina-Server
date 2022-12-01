const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const apicache = require("apicache");

const alertRouter = require("./Routes/alerts/route");
const doctorRouter = require("./Routes/doctor/route");
const patientRouter = require("./Routes/patient/route");
const waitingListRouter = require("./Routes/waitingList/route");
const relativeRouter = require("./Routes/relative/route");
const illnessRouter = require("./Routes/illness/route");
const wilayaRouter = require("./Routes/wilaya/route");
const dairaRouter = require("./Routes/daira/route");
const communeRouter = require("./Routes/commune/route");
const appointmentRouter = require("./Routes/appointment/route");
const drugsRouter = require("./Routes/drugs/route");
const noteRouter = require("./Routes/note/route");
const hospitalRouter = require("./Routes/hospital/route");
const medicalReportRouter = require("./Routes/medicalReport/route");
const ecgRouter = require("./Routes/Ecg/route");

const app = express();
// Static files serving Middleware (allow access to these files publicly)
app.use("/public/views", express.static("public/views"));
app.use("/public/uploads/Media", express.static("public/uploads/Media"));
app.use("/public/views", express.static("public/views"));

app.use(
  cors({
    origin: "*",
  })
);

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// maybe use rate limit later
// const limiter = rateLimit({
//   windowMs:1000*60*10,
//   max:100
// })
// app.use(limiter);

// // to cache responses
// let cache = apicache.middleware;

// Routes
// doctor route
app.use("/doctor", doctorRouter);

// Patient route
app.use("/patient", patientRouter);

// waiting list route
app.use("/waiting_list", waitingListRouter);

// relative route
app.use("/relative", relativeRouter);

// maladie route
app.use("/illness_type", illnessRouter);

// Wilaya route
app.use("/wilaya", wilayaRouter);

// daira route
app.use("/daira", dairaRouter);

// commune route
app.use("/commune", communeRouter);

// appointment route
app.use("/appointment", appointmentRouter);

// appointment route
app.use("/drugs", drugsRouter);

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
  if (err.status == 400) res.status(err.status).send({ code: "Bad_request" });
  res.sendStatus(500);
});

module.exports = app;
