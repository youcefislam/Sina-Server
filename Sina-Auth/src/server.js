const { createServer } = require("http"),
  path = require("path");

require("dotenv").config({ path: path.resolve("../.env") });

require("./database/connection");

const app = require("./app");
const httpServer = createServer(app);

httpServer.listen(process.argv[2]);
