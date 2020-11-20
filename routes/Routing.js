import userController from "../controllers/UserController.js";

const setRoutes = (app) => {
  app.post("/authorize", verifyToken, userController.authorize);
  app.post("/login", userController.login);
  app.post("/register", userController.register);
  app.get("/users", userController.getAllUsers);
  app.get("/user/:userId", userController.getUserWithId);
  app.get("/clear-all-users", userController.clearUsers);
};

export default { setRoutes };

// Authorization: Bearer <access_token>
const verifyToken = (req, res, next) => {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.accessToken = token;
    next();
  } else {
    //unauthorized
    res.status(401);
  }
};
