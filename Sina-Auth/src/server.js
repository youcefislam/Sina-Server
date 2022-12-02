const { createServer } = require("http");
const path = require("path");

const env = path.resolve("../.env");
require("dotenv").config({ path: env });

require("./database/connection");

const app = require("./app");
const httpServer = createServer(app);

httpServer.listen(process.argv[2]);
