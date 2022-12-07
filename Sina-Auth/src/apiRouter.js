const express = require("express");

const patientAuthSubRoute = require("./Routes/patient/route"),
  doctorAuthSubRoute = require("./Routes/doctor/route");

const apiRouter = express.Router();

apiRouter.use("/patient", patientAuthSubRoute);
apiRouter.use("/doctor", doctorAuthSubRoute);

apiRouter.use((err, req, res, next) => {
  if (error.code == "duplicated_entry_error")
    return res.status(400).send(error);
  if (error.name == "JsonWebTokenError" || error.name == "TokenExpiredError")
    return res.status(400).send({
      code: "invalid_link",
      message: "Link expired or not valid anymore",
    });
  res.sendStatus(500);
});

module.exports = apiRouter;
