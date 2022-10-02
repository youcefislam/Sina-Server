const joi = require("joi");

// Data form validation with joi
const medecinSignUp = joi.object({
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
});
const medecinSignIn = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
});
const patientSignUp = joi.object({
  username: joi.string().alphanum().min(6).required(),
  email: joi.string().email().required(),
  password: joi.string().alphanum().min(8).required(),
  repeat_password: joi.ref("password"),
});
const patientInfo = joi.object({
  nom: joi.string().max(50).required(),
  prenom: joi.string().max(50).required(),
  sex: joi.number().max(1).required(),
  dateNaiss: joi.date().required(),
  adress: joi.string().max(255).required(),
  idCommune: joi.number().required(),
  num: joi.string().max(10).required(),
});
const relativeInfo = joi.object({
  nom: joi.string().max(50).required(),
  prenom: joi.string().max(50).required(),
  numeroTlf: joi.string().max(10).required(),
  email: joi.string().email().required(),
});
const patientSignIn = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
});

const medecinSignUpJoi = async (body) => {
  try {
    console.log(body);
    const validBody = await medecinSignUp.validateAsync(body);
    console.log("is valid", validBody);
    console.log("2");
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
const medecinSignInJoi = async (body) => {
  try {
    const validBody = await medecinSignIn.validateAsync(body);
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
const patientSignUpJoi = async (body) => {
  try {
    const validBody = await patientSignUp.validateAsync(body);
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
const patientInfoJoi = async (body) => {
  try {
    const validBody = await patientInfo.validateAsync(body);
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
const relativeInfoJoi = async (body) => {
  try {
    const validBody = await relativeInfo.validateAsync(body);
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
const patientSignInJoi = async (body) => {
  try {
    const validBody = await patientSignIn.validateAsync(body);
    return { value: validBody };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  medecinSignUpJoi,
  medecinSignInJoi,
  patientSignUpJoi,
  patientInfoJoi,
  relativeInfoJoi,
  patientSignInJoi,
};
