const { sendTwilioMessage } = require("../../Utilities/utility");
const patientQuery = require("../patient/queries");
const validateBody = require("../../Utilities/validations");

const sendAlert = async (req, res) => {
  try {
    const body = await validateBody("validAlert", req.body);

    const patient = await patientQuery.searchPatient({ id: req.autData.id });

    if (patient == null) return res.sendStatus(403);

    const messageDoctor = `We detected an arrhythmia of the type ${body.heart_condition} for your patient ${patient.first_name} ${patient.last_name}. His location: https://www.google.com/maps/search/?api=1&query=${body.latitude}%2C${body.longitude} - Sina Team`;
    const messageRelative = `We detected an arrhythmia of the type ${body.heart_condition} for your relative ${patient.first_name} ${patient.last_name}. You need to contact his doctor (${patient.doctor_phone_number}). Your relative's location: https://www.google.com/maps/search/?api=1&query=${body.latitude}%2C${body.longitude} -Sina Team`;
    await Promise.all([
      sendTwilioMessage(patient.doctor_phone_number, messageDoctor),
      sendTwilioMessage(patient.relative_phone_number, messageRelative),
    ]);

    res.sendStatus(200);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.status(500).send({ type: "message_not_sent" });
  }
};

module.exports = {
  sendAlert,
};
