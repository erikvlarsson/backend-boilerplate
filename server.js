import express from "express";
import morgan from "morgan";
import cors from "cors";

import helmet from "helmet";
import bodyParser from "body-parser";
import Config from "./configuration/Config";
import Middleware from "./middleware/Middleware";
import Routing from "./routes/Routing";
import UserController from "./controllers/UserController";
const app = express();

// app.use(morgan("common"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Import Routes
Routing.setRoutes(app);

// Apply Middleware
app.use(Middleware.notFound);
app.use(Middleware.errorHandler);

UserController.getAllUsers().then((users) => {
  console.log(users);
});

Config.connectToMongoDB();
Config.startServer(app);
