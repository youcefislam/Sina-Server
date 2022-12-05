const { sendTwilioMessage } = require("../../Utilities/utility");
const patientQuery = require("../patient/queries");
const { errorHandler } = require("../../Database/Connection");

const sendAlert = async (req, res, next) => {
  try {
    const patient = await patientQuery.selectPatientMinimal({
      id: req.autData.id,
    });

    if (patient == null) return next(new errorHandler("raw_not_found"));

    const messageDoctor = `We detected an arrhythmia of the type ${req.body.heart_condition} for your patient ${patient.first_name} ${patient.last_name}. His location: https://www.google.com/maps/search/?api=1&query=${req.body.latitude}%2C${req.body.longitude} - Sina Team`;
    const messageRelative = `We detected an arrhythmia of the type ${req.body.heart_condition} for your relative ${patient.first_name} ${patient.last_name}. You need to contact his doctor (${patient.doctor_phone_number}). Your relative's location: https://www.google.com/maps/search/?api=1&query=${req.body.latitude}%2C${req.body.longitude} -Sina Team`;
    await Promise.all([
      sendTwilioMessage(patient.doctor_phone_number, messageDoctor),
      sendTwilioMessage(patient.relative_phone_number, messageRelative),
    ]);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendAlert,
};
