const joi = require("joi");

// Data form validation with joi
// need modification at the end of project.
const schema = {
  doctorSignUp: joi
    .object({
      username: joi.string().alphanum().min(6).required(),
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
      mail: joi.string().email().required(),
      first_name: joi.string().max(50).required(),
      last_name: joi.string().max(50).required(),
      phone_number: joi
        .string()
        .length(10)
        .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
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
    phone_number: joi
      .string()
      .length(10)
      .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
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
  validId: joi.object({ id: joi.number().min(1).required() }),
  validValidationCode: joi.object({
    validation_code: joi.number().min(100000).max(999999).required(),
  }),
  validToken: joi.object({
    token: joi.string().required(),
  }),
};

module.exports = { schema };
