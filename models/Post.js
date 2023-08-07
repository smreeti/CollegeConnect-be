const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  imageUrl: {
    type: String,
    required: [true, "Please provide image url"],
  },
  caption: {
    type: String,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isCollegePost: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  remarks: {
    type: String,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
