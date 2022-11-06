const joi = require("joi");

// Data form validation with joi
// modify this garbage at the end of the refactoring
const validations = {
  patientInfo: joi.object({
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
    sex: joi.number().max(1).required(),
    birth_date: joi.date().required(),
    address: joi.string().max(255).required(),
    id_commune: joi.number().required(),
    phone_number: joi.string().max(10).required(),
  }),
  relativeInfo: joi.object({
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
    phone_number: joi.string().max(10).required(),
    mail: joi.string().email().required(),
  }),
  validMail: joi.object({
    mail: joi.string().email().required(),
  }),
  validUsername: joi.object({ username: joi.string().min(6).required() }),
  validNewPassword: joi
    .object({
      old_password: joi.string().alphanum().min(8).required(),
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .with("password", "repeat_password"),
  validName: joi.object({
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
  }),
  validNumber: joi.object({
    phone_number: joi.string().min(9).max(10).required(),
  }),
  validAccept: joi.object({ auto_accept: joi.bool().required() }),
  validDaira: joi.object({
    id_daira: joi.number().required(),
  }),
  validPatientApproval: joi.object({
    id_patient: joi.number().required(),
    severity: joi.number().max(10).required(),
    id_type_illness: joi.number().required(),
  }),
  validDiseaseType: joi.object({
    type: joi.string().max(50).required(),
  }),
  validPatientId: joi.object({ id: joi.number().required() }),
  validId: joi.object({ id: joi.number().required() }),
  validPatientAddress: joi.object({
    id_commune: joi.number().required(),
    address: joi.string().max(255).required(),
  }),
  validDoctorAddress: joi.object({
    id_daira: joi.number().required(),
    address: joi.string().max(255).required(),
  }),
  validAppointment: joi.object({
    id: joi.number().required(),
    date: joi.date().required(),
  }),
  validMedication: joi.object({
    id: joi.number().required(),
    id_medication: joi.number().required(),
    dosage: joi.string().required(),
  }),
  validMedicationId: joi.object({
    id: joi.number().required(),
    id_medication: joi.number().required(),
  }),
  validMedicationName: joi.object({
    name: joi.string().max(50).required(),
  }),
  validNameMedication: joi.object({
    id: joi.number().required(),
    name: joi.string().max(50).required(),
  }),
  validNote: joi.object({
    id: joi.number().required(),
    note: joi.string().max(1000).required(),
  }),
  validHospital: joi.object({
    id: joi.number().required(),
    name: joi.string().max(50).required(),
    address: joi.string().max(255).required(),
    phone_number: joi.string().max(10).required(),
  }),
  validDate: joi.object({ date: joi.date().required() }),
  validAlert: joi.object({
    heartCondition: joi.string().required(),
    latitude: joi.number().required(),
    longitude: joi.number().required(),
  }),
  doctorSearchQuery: joi
    .object({
      username: joi.string().alphanum(),
      mail: joi.string().email(),
    })
    .or("username", "mail"),
  validPassword: joi.object({
    password: joi.string().alphanum().min(8).required(),
  }),
  validPatientFromList: joi.object({
    id: joi.number().required(),
    id_patient: joi.number().required(),
  }),
  validIdDoctor: joi.object({
    id_doctor: joi.number().required(),
  }),
  validPatientRequest: joi.object({
    id_doctor: joi.number().required(),
    id_patient: joi.number().required(),
  }),
  validIdPatient: joi.object({
    id_patient: joi.number().required(),
  }),
  validAcceptTicket: joi.object({
    id_patient: joi.number().required(),
    severity: joi.number().max(5).required(),
    id_illness_type: joi.number().required(),
  }),
};

function validationErrorHandler(error) {
  this.type = "validation_error";
  this.message = error.details[0].message;
  this.path = error.details[0].path[0];
}

const validateBody = async (type, body) => {
  try {
    return await validations[type].validateAsync(body);
  } catch (error) {
    throw new validationErrorHandler(error);
  }
};

module.exports = validateBody;
