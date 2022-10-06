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
  validAccept: joi.object({ auto: joi.number().max(1).required() }),
  validDaira: joi.object({
    daira: joi.number().required(),
  }),
  validPatientApproval: joi.object({
    idPatient: joi.number().required(),
    degreGravite: joi.number().max(10).required(),
    idTypeMaladie: joi.number().required(),
  }),
  validNumber: joi.object({
    number: joi.string().min(10).required(),
  }),
  validDiseaseType: joi.object({
    TypeMaladie: joi.string().max(50).required(),
  }),
  validPatientId: joi.object({ idPatient: joi.number().required() }),
};

const validateBody = async (type, body) => {
  try {
    const value = await validations[type].validateAsync(body);
    return { value };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = validateBody;
