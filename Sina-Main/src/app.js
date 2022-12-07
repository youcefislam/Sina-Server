const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  path = require("path");
// const rateLimit = require("express-rate-limit");
// const apicache = require("apicache");

const apiRouter = require("./apiRouter");

const app = express();

// maybe use rate limit later
// const limiter = rateLimit({
//   windowMs:1000*60*10,
//   max:100
// })
// app.use(limiter);

// // to cache responses
// let cache = apicache.middleware;

app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "public/uploads/Media"))
);

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/api", apiRouter);

// not found
apiRouter.use((req, res) => res.sendStatus(404));

module.exports = app;
