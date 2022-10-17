const joi = require("joi");

// Data form validation with joi
const validations = {
  medecinSignUp: joi.object({
    username: joi.string().alphanum().min(6).required(),
    password: joi.string().alphanum().min(8).required(),
    repeat_password: joi.ref("password"),
    email: joi.string().email().required(),
    nom: joi.string().max(50).required(),
    prenom: joi.string().max(50).required(),
    numeroTlf: joi.number().max(1000000000).required(),
    sex: joi.number().max(1).required(),
    address: joi.string().max(400).required(),
    wilaya: joi.number().required(),
    daira: joi.number().required(),
  }),
  medecinSignIn: joi.object({
    username: joi.string().alphanum().min(6).required(),
    password: joi.string().alphanum().min(8).required(),
  }),
  patientSignUp: joi.object({
    username: joi.string().alphanum().min(6).required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().min(8).required(),
    repeat_password: joi.ref("password"),
  }),
  patientInfo: joi.object({
    nom: joi.string().max(50).required(),
    prenom: joi.string().max(50).required(),
    sex: joi.number().max(1).required(),
    dateNaiss: joi.date().required(),
    adress: joi.string().max(255).required(),
    idCommune: joi.number().required(),
    num: joi.string().max(10).required(),
  }),
  relativeInfo: joi.object({
    nom: joi.string().max(50).required(),
    prenom: joi.string().max(50).required(),
    numeroTlf: joi.string().max(10).required(),
    email: joi.string().email().required(),
  }),
  patientSignIn: joi.object({
    username: joi.string().alphanum().min(6).required(),
    password: joi.string().alphanum().min(8).required(),
  }),
  validMail: joi.object({
    email: joi.string().email().required(),
  }),
  validUsername: joi.object({ username: joi.string().min(6).required() }),
  validNewPassword: joi.object({
    password: joi.string().alphanum().min(8).required(),
    repeat_password: joi.ref("password"),
  }),
  validName: joi.object({
    nom: joi.string().max(50).required(),
    prenom: joi.string().max(50).required(),
  }),
  validNumber: joi.object({
    numeroTlf: joi.string().max(10).required(),
  }),
  validAccept: joi.object({ auto: joi.bool().required() }),
  validDaira: joi.object({
    daira: joi.number().required(),
  }),
  validPatientApproval: joi.object({
    idPatient: joi.number().required(),
    degreGravite: joi.number().max(10).required(),
    idTypeMaladie: joi.number().required(),
  }),
  validDiseaseType: joi.object({
    TypeMaladie: joi.string().max(50).required(),
  }),
  validPatientId: joi.object({ idPatient: joi.number().required() }),
  validId: joi.object({ id: joi.number().required() }),
  validPatientAddress: joi.object({
    commune: joi.number().required(),
    adress: joi.string().max(255).required(),
  }),
  validAppointment: joi.object({
    id: joi.number().required(),
    date: joi.date().required(),
  }),
  validMedication: joi.object({
    id: joi.number().required(),
    idMedicament: joi.number().required(),
    dosage: joi.string().required(),
  }),
  validMedicationId: joi.object({
    id: joi.number().required(),
    idMedicament: joi.number().required(),
  }),
  validMedicationName: joi.object({
    nomMedicament: joi.string().max(50).required(),
  }),
  validNameMedication: joi.object({
    id: joi.number().required(),
    nomMedicament: joi.string().max(50).required(),
  }),
  validNote: joi.object({
    id: joi.number().required(),
    note: joi.string().max(1000).required(),
  }),
  validHospital: joi.object({
    nomHopital: joi.string().max(50).required(),
    adress: joi.string().max(255).required(),
    numeroTlf: joi.string().max(10).required(),
    id: joi.number().required(),
  }),
  validDate: joi.object({ date: joi.date().required() }),
  validAlert: joi.object({
    heartCondition: joi.string().required(),
    latitude: joi.number().required(),
    longitude: joi.number().required(),
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
