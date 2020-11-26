import PostModel from "../models/Post";

const createPost = async (req, res) => {
  const newPost = new PostModel({
    content: req.body.content,
    author: "Erik V Hughes",
  });
  await newPost
    .save()
    .then((response) => {
      if (response) {
        res.status(201).json(response);
      } else {
        res.status(500);
      }
    })
    .catch(() => {
      res.status(500);
    });
};

const deletePost = async (req, res) => {
  await PostModel.deleteOne({
    _id: req.params.postId,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).send({
        error: `Could not find user email.`,
        message: error.message,
      });
    });
};

const updatePost = async (req, res) => {
  const post = await PostModel.findOne({ _id: req.params.postId });
  if (post) {
    post.content = req.body.content;
    await post
      .save()
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        console.log(err);
        res.satus(500);
      });
  }
};

const getPosts = async (req, res) => {
  await PostModel.find({})
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).send({
        error: `Error in getPosts().`,
        message: error.message,
      });
    });
};

export default {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
