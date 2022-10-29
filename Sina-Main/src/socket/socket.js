const { Server } = require("socket.io");
const {
  getSocketByPatientId,
  getPatientSocketByDoctorId,
  getSocketByDoctorId,
  disconnectPatient,
  validateToken,
} = require("../Utilities/utility");

const io = new Server();

io.use(async (socket, next) => {
  const { error, valid } = await validateToken(socket.handshake.auth.token);
  if (error) {
    const err = new Error("not authorized");
    err.data = { content: "Please try again later later" };
    next(err);
  } else {
    if (valid.patient) {
      let statement = "SELECT idMedecin FROM patient WHERE idPatient=?";
      dbPool.query(statement, valid.id, (dbErr, result) => {
        if (dbErr) {
          // datatbase error
          console.log("## db error ## ", dbErr);
          next(err);
        } else {
          valid.idMedecin = result[0].idMedecin;
          socket.autData = valid;
          next();
        }
      });
    } else {
      socket.autData = valid;
      next();
    }
  }
});
io.on("connection", (socket) => {
  console.log("a user connected ", socket.id, " from ", socket.autData);
  socket.on("disconnect", () => {
    // console.log("a user is disconnected ", socket.id);
    if (socket.autData.patient) {
      disconnectPatient(socket);
    } else {
      connectedDoctors = connectedDoctors.filter(
        (item) => item.socketId != socket.id
      );
      doctorSocketIds = doctorSocketIds.filter(
        (item) => item.socket.id != socket.id
      );
      let socketPatient = getPatientSocketByDoctorId(socket.autData.id);
      if (socketPatient) {
        io.to(socketPatient).emit("DoctorGoes", { disconnected: true });
      }
    }
  });
  socket.on("leaveRoom", (data) => {
    let socketPatient = getSocketByPatientId(data.withUserId);
    io.to(socketPatient.id).emit("DoctorGoes", {
      disconnected: true,
      room: data.room,
    });
    socket.leave(data.room);
  });
  socket.on("patientStopRecording", (data) => {
    // console.log(socket.id, " patient stop recording ");
    disconnectPatient(socket);
    socket.leave(data?.room);
  });
  socket.on("loggedin", function (data) {
    // console.log(socket.autData);
    if (socket.autData.patient) {
      patientSocketIds = patientSocketIds.filter(
        (item) => item.userId != socket.autData.id
      );
      patientSocketIds.push({ socket: socket, userId: socket.autData.id });
      connectedPatients = connectedPatients.filter(
        (item) => item.id != socket.autData.id
      );
      connectedPatients.push({ ...socket.autData, socketId: socket.id });
      let socketMedecin = getSocketByDoctorId(socket.autData.idMedecin);
      // console.log(socketMedecin, "    ", socket.autData.idMedecin);
      if (socketMedecin) {
        let connectedPaitientWithId = connectedPatients.filter(
          (item) => item.idMedecin == socket.autData.idMedecin
        );
        // console.log(socketMedecin.id);
        io.to(socketMedecin.id).emit("updateUserList", connectedPaitientWithId);
      }
    } else {
      doctorSocketIds = doctorSocketIds.filter(
        (item) => item.userId != socket.autData.id
      );
      doctorSocketIds.push({ socket: socket, userId: socket.autData.id });
      connectedDoctors = connectedDoctors.filter(
        (item) => item.id != socket.autData.id
      );
      connectedDoctors.push({ ...socket.autData, socketId: socket.id });
      let connectedPaitientWithId = connectedPatients.filter(
        (item) => item.idMedecin == socket.autData.id
      );
      io.to(socket.id).emit("updateUserList", connectedPaitientWithId);
    }
  });
  socket.on("create", function (data) {
    // console.log(socket.id, " joingin the room : ", data.room);
    // console.log("create room");
    socket.join(data?.room);
    let withSocket = getSocketByPatientId(data?.withUserId);
    socket.broadcast.to(withSocket?.id).emit("invite", { data });
    // socket.broadcast.to(socket.id).emit("invite");
  });
  socket.on("joinRoom", function (data) {
    // console.log(socket.id, " patient is joining the room : ", data);
    socket.join(data);
  });
  socket.on("message", function (data) {
    data?.room && socket.broadcast.to(data.room).emit("message", data.message);
  });
  socket.on("disconnectMe", function (data) {
    // console.log(data)
    // if (socket.autData.patient && data.doctorIsWatching ) {
    //   let socketMedecin = getSocketByDoctorId(socket.autData.idMedecin);
    //   // console.log(socketMedecin, "    ", socket.autData.idMedecin);
    //   if (socketMedecin) {
    //     let connectedPaitientWithId = connectedPatients.filter(
    //       (item) => item.idMedecin == socket.autData.idMedecin
    //     );
    //     console.log(socketMedecin.id);
    //     io.to(socketMedecin.id).emit("updateUserList", connectedPaitientWithId);
    //   }
    // }
  });
});

module.exports = io;
