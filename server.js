import express from "express";
import cors from "cors";
import morgan from "morgan";

import helmet from "helmet";
import bodyParser from "body-parser";
import Config from "./configuration/Config";
import Middleware from "./middleware/Middleware";
import Routing from "./routes/Routing";
const app = express();

app.use(morgan("tiny"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     credentials: true,
//   })
// );

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-token"
  );
  if (req.method === "OPTIONS") {
    res.end();
  } else {
    next();
  }
  console.log(res.statusCode);
  if (res.statusCode >= 400) throw new Error(`at ${req.method} ${req.path}`);
});

// Import Routes
Routing.setRoutes(app);

// Apply Middleware
app.use(Middleware.notFound);
app.use(Middleware.errorHandler);

Config.startServer(app);
Config.connectToMongoDB();
