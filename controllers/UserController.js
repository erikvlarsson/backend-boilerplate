import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  // check if user already exists
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    //found
    res.status(302).send();
  } else {
    user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 7),
    });
    try {
      const response = await user.save();
      //created
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error while trying to create new user.",
        error: error.message,
      });
    }
  }
};

const authorize = async (req, res) => {
  console.log(req.accessToken);
  try {
    const authData = jwt.verify(req.accessToken, process.env.ACCESS_TOKEN_KEY);
    res.status(200).send(authData);
  } catch (error) {
    console.log(error);
    res.status(403);
  }
};

const login = async (req, res) => {
  try {
    let user = null;
    await UserModel.findOne({ email: req.body.email }).then((userFound) => {
      user = userFound;
    });
    if (user) {
      // @ts-ignore
      const correctPw = await bcrypt.compare(req.body.password, user.password);
      if (correctPw) {
        const token = await jwt.sign(
          { user: user },
          process.env.ACCESS_TOKEN_KEY,
          { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
        );
        console.log(JSON.stringify(token));
        if (token) {
          res.status(200).send({
            authenticated: true,
            access_token: token,
          });
        }
      } else {
        res.status(401).send("Wrong password.");
      }
    } else {
      res.status(403).send("Couldn't find a user with that email.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error occured upon authentication.");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await UserModel.find();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      error: `Error while trying to fetch users from database.`,
      message: error.message,
    });
  }
};

const getUserWithId = async (req, res) => {
  try {
    const response = await UserModel.findById(req.params.userId);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      error: `Could not find user id.`,
      message: error.message,
    });
  }
};

const clearUsers = async (req, res) => {
  try {
    const response = await UserModel.deleteMany({
      username: req.body.username,
    });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      error: `Could not find user email.`,
      message: error.message,
    });
  }
};

export default {
  authorize,
  register,
  login,
  getAllUsers,
  getUserWithId,
  clearUsers,
};
