const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentReportsSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Please provide description']
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostComments"
    },
    status: {
        type: String
    },
    reportedDate: {
        type: Date,
        default: Date.now
    },
    remarks: {
        type: String
    }
});

const CommentReports = mongoose.model('CommentReports', CommentReportsSchema);
module.exports = CommentReports;

