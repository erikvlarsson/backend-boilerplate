import UserModel from "../models/UserCopy";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 7),
  });
  await user
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("ERROR.");
    });
};

// const registerUser = async (req, res) => {
//   const user = new UserModel({
//     name: req.body.name,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 7),
//   });

//   try {
//     const response = await user.save();
//     res.status(201).send(response);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error while trying to create new user.",
//       error: error.message,
//     });
//   }
// };

const authenticateUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.send("Couldn't find a user with that email.");
    } else {
      // @ts-ignore
      const correctPw = await bcrypt.compare(req.body.password, user.password);
      if (correctPw) {
        //   ..... further code to maintain authentication like jwt or sessions
        res.send("Authentication successful.");
      } else {
        res.send("Wrong password.");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error occured upon authentication.");
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("fetching all users...");
    const response = await UserModel.find();
    console.log("found em!");
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
  registerUser,
  getAllUsers,
  getUserWithId,
  authenticateUser,
  clearUsers,
};
