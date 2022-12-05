const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  path = require("path");
// const rateLimit = require("express-rate-limit");
// const apicache = require("apicache");

const alertRouter = require("./Routes/alerts/route"),
  doctorRouter = require("./Routes/doctor/route"),
  patientRouter = require("./Routes/patient/route"),
  waitingListRouter = require("./Routes/waitingList/route"),
  relativeRouter = require("./Routes/relative/route"),
  illnessRouter = require("./Routes/illness/route"),
  wilayaRouter = require("./Routes/wilaya/route"),
  dairaRouter = require("./Routes/daira/route"),
  communeRouter = require("./Routes/commune/route"),
  appointmentRouter = require("./Routes/appointment/route"),
  drugsRouter = require("./Routes/drugs/route"),
  noteRouter = require("./Routes/note/route"),
  hospitalRouter = require("./Routes/hospital/route"),
  medicalReportRouter = require("./Routes/medicalReport/route"),
  ecgRouter = require("./Routes/Ecg/route");

const middleware = require("./Middlewares/middlewares");

const app = express();

app.use(express.static(path.resolve(__dirname, "public/views")));
app.use(express.static(path.resolve(__dirname, "public/uploads/Media")));

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.query);
  next();
});

// maybe use rate limit later
// const limiter = rateLimit({
//   windowMs:1000*60*10,
//   max:100
// })
// app.use(limiter);

// // to cache responses
// let cache = apicache.middleware;

// authorization middleware
app.use(middleware.tokenAuthorization);

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
app.use("/medical_report", medicalReportRouter);

// ecg route
app.use("/ecg", ecgRouter);

// alert route
app.use("/alert", alertRouter);

app.use("*", (req, res) => res.sendStatus(404));

// handling errors
app.use((error, req, res, next) => {
  if (
    error.code == "duplicated_entry_error" ||
    error.code == "invalid_data" ||
    error.code == "incorrect_information" ||
    error.code == "raw_not_found"
  )
    return res.status(400).send(error);
  res.sendStatus(500);
});

module.exports = app;
