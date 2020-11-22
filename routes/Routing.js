import authController from "../controllers/AuthController.js";

const setRoutes = (app) => {
  app.post("/getRefreshToken", withToken, authController.getRefreshToken);
  app.post("/getAccessToken", withToken, authController.getAccessToken);
  app.post("/login", authController.login);
  app.post("/signup", authController.signup);
  app.get("/clear-all-users", authController.clearUsers);
};

export default { setRoutes };

const withToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.status(401).send("No token found.");
  }
};
