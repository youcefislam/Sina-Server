const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  sendGrid = require("@sendgrid/mail");

require("dotenv").config();

sendGrid.setApiKey(process.env.SEND_GRID_KEY);

const hashValue = async (input) => {
  try {
    return await bcrypt.hash(input, Number(process.env.SALT_ROUNDS));
  } catch (error) {
    throw new Error(error);
  }
};

const compareHashedValues = async (password, validPassword) => {
  try {
    return await bcrypt.compare(password, validPassword);
  } catch (error) {
    throw new Error(error);
  }
};

const generateAccessToken = async (values, options = {}) => {
  try {
    return await jwt.sign(values, process.env.MY_SECRET_KEY, options);
  } catch (error) {
    throw new Error(error);
  }
};

const generateRefreshToken = async (values, options = {}) => {
  try {
    return await jwt.sign(values, process.env.REFRESH_SECRET_KEY, options);
  } catch (error) {
    throw new Error(error);
  }
};

const generateValidationToken = async (values, options = {}) => {
  try {
    return await jwt.sign(values, process.env.VALIDATION_SECRET_KEY, options);
  } catch (error) {
    throw new Error(error);
  }
};

const generateResetToken = async (values, options = {}) => {
  try {
    return await jwt.sign(values, process.env.RESET_SECRET_KEY, options);
  } catch (error) {
    throw new Error(error);
  }
};

const validateRefreshToken = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.REFRESH_SECRET_KEY);
    return valid;
  } catch (error) {
    throw error;
  }
};

const validateValidationToken = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.VALIDATION_SECRET_KEY);
    return valid;
  } catch (error) {
    throw error;
  }
};

const validateResetToken = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.RESET_SECRET_KEY);
    return valid;
  } catch (error) {
    throw error;
  }
};

const sendMail = async (to, subject, html) => {
  const mail = {
    to,
    from: "sina.app.pfe@outlook.fr",
    subject,
    text: "Sina support team",
    html,
  };
  try {
    await sendGrid.send(mail);
  } catch (error) {
    throw new Error(error);
  }
};

const createValidationCode = () => Math.floor(Math.random() * 899999 + 100000);

module.exports = {
  hashValue,
  createValidationCode,
  compareHashedValues,
  generateAccessToken,
  generateRefreshToken,
  generateValidationToken,
  validateRefreshToken,
  validateValidationToken,
  sendMail,
  validateResetToken,
  generateResetToken,
};
