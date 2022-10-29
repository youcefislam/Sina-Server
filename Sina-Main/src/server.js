const { createServer } = require("http");
const path = require("path");

const env = path.resolve("../.env");
require("dotenv").config({ path: env });

require("./database/connection");
require("./database/Initialize");

const app = require("./app");
const httpServer = createServer(app);
const io = require("./socket/socket");

io.attach(httpServer);

const PORT = process.env.MAIN_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});
