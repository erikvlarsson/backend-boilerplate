import authController from "../controllers/AuthController.js";
import jwt from "jsonwebtoken";

const setRoutes = (app) => {
  app.post(
    "/getRefreshToken",
    withToken,
    authRefresh,
    authController.getRefreshToken
  );
  app.post(
    "/getAccessToken",
    withToken,
    authRefresh,
    authController.getAccessToken
  );
  app.post("/login", authController.login);
  app.post("/signup", authController.signup);
  app.get("/clear-all-users", authController.clearUsers);
  app.get("/secret", withToken, authAccess, authController.secret);
};

export default { setRoutes };

const authAccess = (req, res, next) => {
  const decoded = jwt.verify(req.token, process.env.ACCESS_TOKEN_KEY);
  if (decoded) {
    req.user = decoded.user;
    next();
  } else {
    res.sendStatus(401);
  }
};

const authRefresh = (req, res, next) => {
  const decoded = jwt.verify(req.token, process.env.REFRESH_TOKEN_KEY);
  if (decoded) {
    req.user = decoded.user;
    next();
  } else {
    res.sendStatus(401);
  }
};

const withToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader && bearerHeader.split(" ")[1];
  if (token) {
    req.token = token;
    next();
  } else {
    res.sendStatus(401);
  }
};
