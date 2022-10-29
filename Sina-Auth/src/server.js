const { createServer } = require("http");
const path = require("path");

const env = path.resolve("../.env");
require("dotenv").config({ path: env });

require("./database/connection");

const app = require("./app");
const httpServer = createServer(app);

const PORT = process.env.AUTH_PORT || 4001;

httpServer.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
