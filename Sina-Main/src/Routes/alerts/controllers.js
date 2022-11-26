const { sendTwilioMessage } = require("../../Utilities/utility");
const patientQuery = require("../patient/queries");

const sendAlert = async (req, res) => {
  try {
    const patient = await patientQuery.searchPatient({ id: req.autData.id });

    if (patient == null) return res.sendStatus(403);

    const messageDoctor = `We detected an arrhythmia of the type ${req.body.heart_condition} for your patient ${req.patient.first_name} ${req.patient.last_name}. His location: https://www.google.com/maps/search/?api=1&query=${req.body.latitude}%2C${req.body.longitude} - Sina Team`;
    const messageRelative = `We detected an arrhythmia of the type ${req.body.heart_condition} for your relative ${req.patient.first_name} ${req.patient.last_name}. You need to contact his doctor (${req.patient.doctor_phone_number}). Your relative's location: https://www.google.com/maps/search/?api=1&query=${req.body.latitude}%2C${req.body.longitude} -Sina Team`;
    await Promise.all([
      sendTwilioMessage(patient.doctor_phone_number, messageDoctor),
      sendTwilioMessage(patient.relative_phone_number, messageRelative),
    ]);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  sendAlert,
};
