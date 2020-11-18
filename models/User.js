import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    email: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
