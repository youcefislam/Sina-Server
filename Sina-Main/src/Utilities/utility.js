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
    return await bcrypt.hash(input, Number(process.env.SALT_ROUNDS));
  } catch (error) {
    throw new Error(error);
  }
};

const comparePassword = async (password, validPassword) => {
  try {
    return await bcrypt.compare(password, validPassword);
  } catch (error) {
    throw new Error(error);
  }
};

const validateAccessToken = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.MY_SECRET_KEY);
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

const sendTwilioMessage = (to, message) =>
  new Promise((resolve, reject) => {
    client.messages
      .create({
        body: message,
        to: "+213" + to,
        from: process.env.TWILIO_PHONE_NUMBER,
      })
      .then((message) => {
        resolve(message);
      })
      .catch((error) => {
        reject(error);
      });
  });

// socketio connection

patientSocketIds = [];
connectedPatients = [];
doctorSocketIds = [];
connectedDoctors = [];

const getSocketByPatientId = (userId) => {
  let socket = "";
  for (let i = 0; i < patientSocketIds.length; i++) {
    if (patientSocketIds[i].userId == userId) {
      socket = patientSocketIds[i].socket;
      break;
    }
  }
  return socket;
};
const getPatientSocketByDoctorId = (userId) => {
  let socket = "";
  for (let i = 0; i < connectedPatients.length; i++) {
    if (connectedPatients[i].idMedecin == userId) {
      socket = connectedPatients[i].socketId;
      break;
    }
  }
  return socket;
};
const getSocketByDoctorId = (userId) => {
  let socket = "";
  for (let i = 0; i < doctorSocketIds.length; i++) {
    if (doctorSocketIds[i].userId == userId) {
      socket = doctorSocketIds[i].socket;
      break;
    }
  }
  return socket;
};

const disconnectPatient = (socket) => {
  connectedPatients = connectedPatients.filter(
    (item) => item.socketId != socket.id
  );
  patientSocketIds = patientSocketIds.filter(
    (item) => item.socket.id != socket.id
  );
  let socketMedecin = getSocketByDoctorId(socket.autData.idMedecin);
  if (socketMedecin) {
    let connectedPaitientWithId = connectedPatients.filter(
      (item) => item.idMedecin == socket.autData.idMedecin
    );
    io.to(socketMedecin.id).emit("updateUserList", connectedPaitientWithId);
  }
};

module.exports = {
  deleteFile_fs,
  hashPassword,
  comparePassword,
  validateAccessToken,
  sendMail,
  sendTwilioMessage,
  getSocketByPatientId,
  getPatientSocketByDoctorId,
  getSocketByDoctorId,
  disconnectPatient,
};
