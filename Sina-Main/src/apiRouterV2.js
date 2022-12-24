const express = require("express"),
  bodyParser = require("body-parser");

const alertSubRouter = require("./routes/alerts/route"),
  doctorSubRouter = require("./routes/doctor/route"),
  patientSubRouter = require("./routes/patient/route"),
  waitingListSubRouter = require("./routes/waitingList/route"),
  relativeSubRouter = require("./routes/relative/route"),
  illnessSubRouter = require("./routes/illness/route"),
  wilayaSubRouter = require("./routes/wilaya/route"),
  dairaSubRouter = require("./routes/daira/route"),
  communeSubRouter = require("./routes/commune/route"),
  appointmentSubRouter = require("./routes/appointment/route"),
  drugsSubRouter = require("./routes/drugs/route"),
  noteSubRouter = require("./routes/note/route"),
  hospitalSubRouter = require("./routes/hospital/route"),
  medicalReportSubRouter = require("./routes/medicalReport/route"),
  ecgSubRouter = require("./routes/ecg/route");

const middleware = require("./Middlewares/middlewares");

const apiRouter = express.Router();

// authorization middleware
apiRouter.use(middleware.tokenAuthorization);

// Routes
// doctor route
apiRouter.use("/doctor", doctorSubRouter);

// Patient route
apiRouter.use("/patient", patientSubRouter);

// waiting list route
apiRouter.use("/waiting_list", waitingListSubRouter);

// relative route
apiRouter.use("/relative", relativeSubRouter);

// maladie route
apiRouter.use("/illness_type", illnessSubRouter);

// Wilaya route
apiRouter.use("/wilaya", wilayaSubRouter);

// daira route
apiRouter.use("/daira", dairaSubRouter);

// commune route
apiRouter.use("/commune", communeSubRouter);

// appointment route
apiRouter.use("/appointment", appointmentSubRouter);

// appointment route
apiRouter.use("/drugs", drugsSubRouter);

// note route
apiRouter.use("/note", noteSubRouter);

// hospital route
apiRouter.use("/hospital", hospitalSubRouter);

// medical report route
apiRouter.use("/medical-report", medicalReportSubRouter);

// ecg route
apiRouter.use("/ecg", ecgSubRouter);

// alert route
apiRouter.use("/alert", alertSubRouter);

// handling errors
apiRouter.use((error, req, res, next) => {
  console.log(error);
  if (
    error.code == "duplicated_entry_error" ||
    error.code == "invalid_data" ||
    error.code == "incorrect_information" ||
    error.code == "raw_not_found"
  )
    return res.status(400).send(error);
  res.sendStatus(500);
});

module.exports = apiRouter;
