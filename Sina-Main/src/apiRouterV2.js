const express = require("express"),
  bodyParser = require("body-parser");

const alertSubRouter = require("./Routes/alerts/route"),
  doctorSubRouter = require("./Routes/doctor/route"),
  patientSubRouter = require("./Routes/patient/route"),
  waitingListSubRouter = require("./Routes/waitingList/route"),
  relativeSubRouter = require("./Routes/relative/route"),
  illnessSubRouter = require("./Routes/illness/route"),
  wilayaSubRouter = require("./Routes/wilaya/route"),
  dairaSubRouter = require("./Routes/daira/route"),
  communeSubRouter = require("./Routes/commune/route"),
  appointmentSubRouter = require("./Routes/appointment/route"),
  drugsSubRouter = require("./Routes/drugs/route"),
  noteSubRouter = require("./Routes/note/route"),
  hospitalSubRouter = require("./Routes/hospital/route"),
  medicalReportSubRouter = require("./Routes/medicalReport/route"),
  ecgSubRouter = require("./Routes/Ecg/route");

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
