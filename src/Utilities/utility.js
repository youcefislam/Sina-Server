const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendGrid = require("@sendgrid/mail");
// const client = require("twilio")(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

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

const generateToken = async (values, options = {}) => {
  try {
    const token = await jwt.sign(values, process.env.MY_SECRET_KEY, options);
    return { token };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const validateToken = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.MY_SECRET_KEY);
    return { valid };
  } catch (error) {
    console.log(error);
    return { error };
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
    const mailSent = await sendGrid.send(mail);
    return { mailSent };
  } catch (error) {
    console.log(error.body);
    return { error };
  }
};

const sendTwilloMessage = (to, message) => {
  console.log("sms sent");
  return;
  // client.messages
  //   .create({
  //     body: message,
  //     to: "+213" + to,
  //     from: "+19207064918",
  //   })
  //   .then((message) => {
  //     res.end();
  //     console.log("sms sent");
  //   })
  //   // here you can implement your fallback code
  //   .catch((error) => {
  //     res.sendStatus(500);
  //     console.log(error);
  //   });
};

const createValidationCode = () => Math.floor(Math.random() * 899999 + 100000);

module.exports = {
  deleteFile_fs,
  hashPassword,
  comparePassword,
  generateToken,
  validateToken,
  sendMail,
  createValidationCode,
  sendTwilloMessage,
};
