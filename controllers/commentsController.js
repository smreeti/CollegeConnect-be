const Post = require("../models/Post");
const PostComments = require("../models/PostComments");
const HttpStatus = require("../utils/HttpStatus");
const { setErrorResponse, setSuccessResponse } = require("../utils/Response");

const saveComments = async (req, res) => {
    const { comment, postId } = req.body;
    const user = req.user;

    const post = await Post.findById(postId);

    if (post) {
        await PostComments.create({
            comment,
            commentedBy: user,
            post
        });

        await updatePostCommentCount(postId);
        return setSuccessResponse(res, HttpStatus.CREATED, "Comment added successfully.");
    } else {
        return setErrorResponse(res, HttpStatus.NOT_FOUND, "Post not found.");
    }
}

const updatePostCommentCount = async (postId) => {
    await Post.findByIdAndUpdate(postId, {
        $inc: { comments: 1 }
    });
}

const fetchPostComments = async (postId) => {
    const postComments = await PostComments.find({
        post: postId,
        status: 'ACTIVE'
    })
        .populate({
            path: "commentedBy",
            select: "username profilePicture"
        })
        .select("comment createdDate");

    return postComments;
}

const deleteComment = async (req, res) => {
    const { postCommentId, postId } = req.body;
    await PostComments.findByIdAndDelete(postCommentId);
    await Post.findByIdAndUpdate(postId, {
        $inc: { comments: -1 }
    });
    return setSuccessResponse(res, "Comment deleted");
}

module.exports = { saveComments, fetchPostComments, deleteComment };