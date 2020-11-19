import userController from "../controllers/UserController.js";

const setRoutes = (app) => {
  app.post("/register", userController.registerUser);
  app.post("/authenticate", userController.authenticateUser);
  app.get("/users", userController.getAllUsers);
  app.get("/user/:userId", userController.getUserWithId);
  app.get("/clear-all-users", userController.clearUsers);
};

export default { setRoutes };
