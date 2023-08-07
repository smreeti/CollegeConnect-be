const Post = require("../models/Post");
const User = require("../models/User");

const HttpStatus = require("../utils/HttpStatus.js");
const {
  setSuccessResponse,
  setErrorResponse,
} = require("../utils/Response.js");

const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const hasLike = post.likes.filter((like) => {
      return like.user?.toString() === req.user.id;
    });

    if (hasLike.length > 0) {
      const removeLike = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeLike, 1);
      await post.save();
      return setSuccessResponse(res, "Post has been unliked", {
        post,
      });
    } else {
      post.likes.unshift({ user: req.user.id });
      await post.save();
      return setSuccessResponse(res, "Post has been liked", {
        post,
      });
    }
  } catch (err) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const fetchPostLikes = async (req, res) => {
  const { _id } = req.body;
  try {
    const result = _id.map((a) => a.user);
    const postLikes = await User.find({ _id: result });

    return setSuccessResponse(res, "Posts fetched successfully", {
      postLikes,
    });
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  likeUnlikePost,
  fetchPostLikes,
};
