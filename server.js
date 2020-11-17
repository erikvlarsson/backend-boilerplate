import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import Config from "./configuration/Config";
import Middleware from "./middleware/Middleware";
import Routing from "./routes/Routing";

const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import Routes
Routing.setRoutes(app);

// Apply Middleware
app.use(Middleware.notFound);
app.use(Middleware.errorHandler);

Config.connectToMongoDB();
Config.startServer(app);
