const joi = require("joi");

// Data form validation with joi
// need modification at the end of project.
const validations = {
  doctorSignUp: joi
    .object({
      username: joi.string().alphanum().min(6).required(),
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
      mail: joi.string().email().required(),
      first_name: joi.string().max(50).required(),
      last_name: joi.string().max(50).required(),
      phone_number: joi.number().max(1000000000).required(),
      sex: joi.number().max(1).required(),
      address: joi.string().max(400).required(),
      id_daira: joi.number().required(),
    })
    .with("password", "repeat_password"),
  signIn: joi.object({
    username: joi.string().alphanum().min(6).required(),
    password: joi.string().alphanum().min(8).required(),
  }),
  patientSignUp: joi
    .object({
      username: joi.string().alphanum().min(6).required(),
      mail: joi.string().email().required(),
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .with("password", "repeat_password"),
  patientInfo: joi.object({
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
    sex: joi.number().max(1).required(),
    birth_date: joi.date().required(),
    address: joi.string().max(255).required(),
    id_commune: joi.number().required(),
    phone_number: joi.string().max(10).required(),
  }),
  validMail: joi.object({
    mail: joi.string().email().required(),
  }),
  validUsername: joi.object({ username: joi.string().min(6).required() }),
  validNewPassword: joi
    .object({
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .with("password", "repeat_password"),
  validId: joi.object({ id: joi.number().required() }),
  validValidationCode: joi.object({
    mail: joi.string().email().required(),
    validation_code: joi.number().min(100000).max(999999).required(),
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
