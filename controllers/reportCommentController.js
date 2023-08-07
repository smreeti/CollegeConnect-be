const CommentReports = require("../models/CommentReports");
const Post = require("../models/Post");
const PostComments = require("../models/PostComments");
const { PENDING, APPROVED, BLOCKED, REJECTED } = require("../utils/ReportStatus");
const { setErrorResponse, setSuccessResponse } = require("../utils/Response");
const { saveUserNotification } = require("./userNotificationController");

const reportComment = async (req, res) => {
    const { selectedPostCommentId, description } = req.body;
    const loggedInUser = req.user;

    try {
        const errors = await validateReportRequest(selectedPostCommentId, description);
        if (errors.length > 0)
            return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

        const selectedPostComment = await PostComments.findById(selectedPostCommentId)
            .populate({
                path: "post",
                populate: {
                    path: "postedBy",
                    model: "User",
                },
            });

        if (selectedPostComment) {
            await CommentReports.create({
                description,
                reportedBy: loggedInUser,
                postComment: selectedPostComment,
                status: PENDING,
                collegeInfoId: loggedInUser.collegeInfoId,
                postedBy: selectedPostComment.post.postedBy
            })
            return setSuccessResponse(res, "Comment reported successfully");
        } else
            return setErrorResponse(res, HttpStatus.NOT_FOUND, "Comment not found");
    } catch (error) {
        return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}

const validateReportRequest = async (selectedPostCommentId, description) => {
    const errors = {};

    if (!selectedPostCommentId)
        errors.push("Comment must be selected");

    if (!description)
        errors.push("Description is required");

    return errors;
}

const fetchCommentReports = async (req, res) => {
    const loggedInUser = req.user;

    try {
        const postReports = await fetchCommentReportsById(loggedInUser.collegeInfoId._id);
        return setSuccessResponse(res, "Comment Reports fetched successfully", postReports);
    } catch (error) {
        return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}

const fetchCommentReportsById = async (collegeId) => {
    return await CommentReports.find({
        status: "PENDING",
    })
        .populate({
            path: "reportedBy",
            match: {
                collegeInfoId: collegeId,
            },
        })
        .populate('postedBy')
        .populate({
            path: "postComment",
            populate: {
                path: "post",
                model: "Post",
            },
        })
        .populate({
            path: "postComment",
            populate: {
                path: "commentedBy",
                model: "User",
            },
        });
}

const handleApproveCommentReports = async (req, res) => {
    const { commentReportsId, remarks } = req.body;

    try {
        const commentReports = await CommentReports.findByIdAndUpdate(commentReportsId, {
            status: APPROVED,
            remarks
        }, { new: true }).populate({
            path: "postComment",
            populate: {
                path: "post",
                model: "Post",
            },
        });

        await updatePostComment(commentReports, remarks);

        return setSuccessResponse(res, "Comment Report approved successfully");
    } catch (error) {
        return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}

const updatePostComment = async (commentReports, remarks) => {

    const { description, postComment, postedBy } = commentReports;

    await updatePostCommentStatus(postComment._id, BLOCKED, description);

    await Post.findByIdAndUpdate(postComment.post._id, {
        $inc: { comments: -1 }
    });

    const userNotificationObj = {
        remarks,
        subject: "Comment Removed by Admin",
        post: postComment.post,
        user: postedBy,
        postComment
    }

    await saveUserNotification(userNotificationObj);
}

const updatePostCommentStatus = async (postCommentId, status, remarks) => {
    await PostComments.findByIdAndUpdate(
        postCommentId,
        {
            status,
            remarks,
        },
        { new: true }
    );
};

const handleRejectCommentReports = async (req, res) => {
    const { commentReportsId, remarks } = req.body;

    try {
        const commentReports = await CommentReports.findByIdAndUpdate(commentReportsId, {
            status: REJECTED,
            remarks
        }, { new: true }).populate({
            path: "postComment",
            populate: {
                path: "post",
                model: "Post",
            },
        }).populate('reportedBy');

        const { postComment, reportedBy } = commentReports;

        const userNotificationObj = {
            remarks,
            subject: "Comment Report Rejected By Admin",
            post: postComment.post,
            user: reportedBy,
            postComment
        }

        await saveUserNotification(userNotificationObj);

        return setSuccessResponse(res, "Post Report rejected successfully");
    } catch (error) {
        return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}


module.exports = { reportComment, fetchCommentReports, handleApproveCommentReports, handleRejectCommentReports }