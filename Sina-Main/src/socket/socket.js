const { Server } = require("socket.io");
const utility = require("../utilities/utility");
const middleware = require("../middlewares/middlewares");
const io = new Server();

const logOutRoomsNotification = (socket, event) => {
  const roomSet = socket.rooms.values();
  roomSet.next();
  io.to(roomSet.next().value).emit(event, {
    disconnected: true,
  });
};

io.use(middleware.socketTokenAuthorization);
io.use(middleware.socketAccountIdentification);

io.on("connection", (socket) => {
  console.log("a user connected ", socket.id, " from ", socket.autData);
  socket.on("disconnect", () => {
    console.log("a user disconnected ", socket.id, " from ", socket.autData);
    if (socket.autData.patient) {
      logOutRoomsNotification(socket, "patientDisconnected");
      utility.disconnectPatient(socket);
      utility.patientLogOutNotifyDoctor(socket);
    } else {
      logOutRoomsNotification(socket, "DoctorDisconnected");
      utility.disconnectDoctor(socket);
    }

    socket.disconnect(true);
  });

  socket.on("doctorLeaveRoom", (data) => {
    io.to(data.room).emit("DoctorGone", "Doctor left the room");
    socket.leave(data.room);
  });

  socket.on("logIn", function (data) {
    if (socket.autData.patient) {
      utility.patientLogIn(socket);
      utility.patientLogInNotification(socket);
    } else {
      utility.doctorLogIn(socket);
      utility.sendConnectedPatientList(socket);
    }
  });

  socket.on("createRoom", function (data) {
    const room = `${socket.autData.id}-${data.id_patient}`;
    let patientSocket = utility.getSocketByPatientId(data.id_patient);
    if (patientSocket) {
      patientSocket.emit("invite", { room });
      socket.join(room);
      patientSocket.join(room);
    } else socket.emit("error", { code: "patient_not_connected" });
  });

  socket.on("message", function (data) {
    console.log("message");
    if (data?.room) {
      socket.to(data.room).emit("message", data.message);
    } else socket.emit("error", { code: "room_required" });
  });
});

module.exports = io;
