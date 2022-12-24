const { createServer } = require("http"),
  path = require("path");

const trace_events = require("trace_events");
const categories = ["node.async_hooks"];
const tracing = trace_events.createTracing({ categories });
tracing.enable();

const PORT = process.argv[2] || 3000;
require("dotenv").config({ path: path.resolve("../.env") });

require("./database/connection");
require("./database/initialize");

const app = require("./app");
const httpServer = createServer(app);
const io = require("./socket/socket");

io.attach(httpServer);

process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c). Graceful shutdown ",
    new Date().toISOString()
  );
  tracing.disable();
  process.exit(1);
});

httpServer.listen(PORT);
