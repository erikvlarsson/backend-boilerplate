import mongoose from "mongoose";

// @ts-ignore
const userSchema = mongoose.Schema(
  {
    name: String,
    password: String,
    email: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
