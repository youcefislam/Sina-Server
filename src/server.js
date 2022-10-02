const { createServer } = require("http");

require("dotenv").config();

require("./database/connection");
require("./database/Initialize");

const app = require("./appTemp");
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
