const express = require("express");

const patientAuthSubRoute = require("./Routes/patient/route"),
  doctorAuthSubRoute = require("./Routes/doctor/route");

const apiRouter = express.Router();

apiRouter.use("/patient", patientAuthSubRoute);
apiRouter.use("/doctor", doctorAuthSubRoute);

apiRouter.use((err, req, res, next) => {
  console.log(err);
  if (err.code == "duplicated_entry_error") return res.status(400).send(err);
  if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError")
    return res.status(400).send({
      code: "invalid_link",
      message: "Link expired or not valid anymore",
    });
  res.sendStatus(500);
});

module.exports = apiRouter;
