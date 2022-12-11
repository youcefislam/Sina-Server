const fs = require("fs"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  sendGrid = require("@sendgrid/mail");
// client = require("twilio")(
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

const getSocketByPatientId = (patientId) => {
  const socket = patientSocketIds.find(
    (patient) => patient.userId == patientId
  );
  return socket?.socket;
};
const getPatientSocketByDoctorId = (doctorId) => {
  const socket = connectedPatients.find(
    (patient) => patient.id_doctor == doctorId
  );
  return socket?.socketId;
};
const getSocketByDoctorId = (doctorId) => {
  const socket = doctorSocketIds.find((doctor) => doctor.userId == doctorId);
  return socket?.socket;
};

const deletePatientSocket = (socket) => {
  connectedPatients = connectedPatients.filter(
    (patient) => patient.socketId != socket.id
  );
  patientSocketIds = patientSocketIds.filter(
    (patient) => patient.socket.id != socket.id
  );
};

const disconnectPatient = (socket) => {
  deletePatientSocket(socket);
};

const patientLogOutNotifyDoctor = (patientSocket) => {
  let socketDoctor = getSocketByDoctorId(patientSocket.autData.id_doctor);
  if (socketDoctor) {
    let connectedPatientId = connectedPatients.filter(
      (patient) => patient.id_doctor == patientSocket.autData.id_doctor
    );
    socketDoctor.emit("updatePatientList", connectedPatientId);
  }
};

const patientLogInNotification = (socket) => {
  let doctorSocket = getSocketByDoctorId(socket.autData.id_doctor);
  if (doctorSocket) {
    let connectedPatientWithId = connectedPatients.filter(
      (item) => item.id_doctor == socket.autData.id_doctor
    );
    doctorSocket.emit("updatePatientList", connectedPatientWithId);
  }
};

const deleteDoctorSocket = (socket) => {
  connectedDoctors = connectedDoctors.filter(
    (doctor) => doctor.socketId != socket.id
  );
  doctorSocketIds = doctorSocketIds.filter(
    (doctor) => doctor.socket.id != socket.id
  );
};

const disconnectDoctor = (socket) => {
  deleteDoctorSocket(socket);
};

const patientLogIn = (socket) => {
  patientSocketIds = patientSocketIds.filter(
    (patient) => patient.userId != socket.autData.id
  );
  patientSocketIds.push({ socket: socket, userId: socket.autData.id });
  connectedPatients = connectedPatients.filter(
    (patient) => patient.id != socket.autData.id
  );
  connectedPatients.push({ ...socket.autData, socketId: socket.id });
};

const doctorLogIn = (socket) => {
  doctorSocketIds = doctorSocketIds.filter(
    (doctor) => doctor.userId != socket.autData.id
  );
  doctorSocketIds.push({ socket: socket, userId: socket.autData.id });
  connectedDoctors = connectedDoctors.filter(
    (doctor) => doctor.id != socket.autData.id
  );
  connectedDoctors.push({ ...socket.autData, socketId: socket.id });
};

const sendConnectedPatientList = (socket) => {
  let connectedPatientWithId = connectedPatients.filter(
    (item) => item.id_doctor == socket.autData.id
  );
  socket.emit("updateUserList", connectedPatientWithId);
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
  disconnectDoctor,
  sendConnectedPatientList,
  doctorLogIn,
  patientLogIn,
  patientLogInNotification,
  patientLogOutNotifyDoctor,
};
