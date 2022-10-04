const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SEND_GRID_KEY);

require("dotenv").config();

const deleteFile_fs = async (path) => {
  try {
    const deletion = await fs.unlink(path.normalize(path));
    return;
  } catch (error) {
    console.log(error);
  }
};

const hashPassword = async (input) => {
  try {
    const hash = await bcrypt.hash(input, Number(process.env.SALT_ROUNDS));
    return { hash };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const comparePassword = async (password, validPassword) => {
  try {
    const correct = await bcrypt.compare(password, validPassword);
    return { correct };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const generateToken = async (values) => {
  try {
    const token = await jwt.sign(values, process.env.MY_SECRET_KEY);
    return { token };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const sendMail = async (mail) => {
  try {
    const mailSent = await sendGrid.send(mail);
    console.log(mailSent);
    return { mailSent };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  deleteFile_fs,
  hashPassword,
  comparePassword,
  generateToken,
  sendMail,
};
