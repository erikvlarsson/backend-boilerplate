import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: String,
    author: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", PostSchema);

export default PostModel;
