import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getRefreshToken = async (req, res) => {
  try {
    const originalRefreshToken = req.token;
    const decoded = jwt.verify(
      originalRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    const user = await UserModel.findOne({ _id: decoded.user._id });
    if (decoded && user) {
      const refreshToken = createRefreshToken(user._id);
      const accessToken = createRefreshToken(user);
      res
        .status(201)
        .json({ refreshToken: refreshToken, accessToken: accessToken });
    } else {
      res.status(403).send();
    }
  } catch (error) {
    console.log(error);
    res.status(401);
  }
};

const getAccessToken = async (req, res) => {
  const refreshToken = req.token;
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
  if (decoded) {
    await UserModel.findOne({ _id: decoded.user._id })
      .then((user) => {
        if (user) {
          const accessToken = createAccessToken(user);
          res.status(201).json({ accessToken: accessToken });
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

// response object includes tokens in .data
const login = async (req, res) => {
  try {
    let user = null;
    await UserModel.findOne({ email: req.body.email }).then((userFound) => {
      user = userFound;
    });
    if (user) {
      // evaluates to true or false
      const correctPw = await bcrypt.compare(req.body.password, user.password);
      if (correctPw) {
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user._id);
        if (accessToken && refreshToken) {
          res.status(200).json({
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

// response object includes tokens in .data
const signup = async (req, res) => {
  // check if email already exists
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    res.status(302).send();
  } else {
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 7),
    });
    try {
      const user = await newUser.save();
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user._id);
      if (accessToken && refreshToken) {
        res.status(201).json({
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

const createRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    {
      user: {
        _id: userId,
      },
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
  );
  return refreshToken;
};

const createAccessToken = (userData) => {
  const accessToken = jwt.sign(
    {
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
      },
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
  );
  return accessToken;
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
