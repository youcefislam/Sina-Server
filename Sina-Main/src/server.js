const { createServer } = require("http"),
  path = require("path");

require("dotenv").config({ path: path.resolve("../.env") });

require("./database/connection");
require("./database/Initialize");

const app = require("./app");
const httpServer = createServer(app);
const io = require("./socket/socket");

io.attach(httpServer);

httpServer.listen(process.argv[2]);
