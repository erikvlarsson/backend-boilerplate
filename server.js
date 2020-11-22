import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import Config from "./configuration/Config";
import Middleware from "./middleware/Middleware";
import Routing from "./routes/Routing";
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  next();
  if (res.statusCode >= 400) throw new Error(`at ${req.method} ${req.path}`);
});

// Routes
Routing.setRoutes(app);

// Apply Middleware
// app.use(Middleware.notFound);
// app.use(Middleware.errorHandler);

Config.startServer(app);
Config.connectToMongoDB();
