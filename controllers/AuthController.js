// @ts-nocheck
import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  // check if email already exists
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    res.status(302).send();
  } else {
    user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 7),
    });
    try {
      const userData = await user.save();
      const accessToken = jwt.sign(
        {
          user: {
            id: userData._id,
            name: userData.name,
            email: userData.email,
          },
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
      );
      const refreshToken = jwt.sign(
        {
          id: userData._id,
        },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
      );
      if (accessToken && refreshToken) {
        res.status(201).send({
          authenticated: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while trying to create new user.");
    }
  }
};

const getAccessToken = async (req, res) => {
  const refreshToken = req.token;
  const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
  if (userData) {
    await UserModel.findOne({ id: userData.id })
      .then((user) => {
        if (user) {
          const accessToken = jwt.sign(
            {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
              },
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
          );
          res.status(201).send({
            accessToken: accessToken,
          });
        } else {
          res.status(403).send();
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.status(401).send();
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const originalRefreshToken = req.token;
    const userData = jwt.verify(
      originalRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    if (userData.id) {
      const refreshToken = jwt.sign(
        { userData },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: process.env.REFRESH_TOKEN_LIFESPAN,
        }
      );
      res.status(201).send({
        id: userData.id,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(401);
  }
};

const login = async (req, res) => {
  try {
    let user = null;
    await UserModel.findOne({ email: req.body.email }).then((userFound) => {
      user = userFound;
    });
    if (user) {
      const correctPw = bcrypt.compare(req.body.password, user.password);
      if (correctPw) {
        const accessToken = jwt.sign(
          { user: user },
          process.env.ACCESS_TOKEN_KEY,
          { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
        );
        const refreshToken = jwt.sign(
          { user: user },
          process.env.REFRESH_TOKEN_KEY,
          { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
        );
        if (accessToken && refreshToken) {
          res.status(200).send({
            authenticated: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
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
  signup,
  login,
  getRefreshToken,
  getAccessToken,
  clearUsers,
};
