const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostCommentsSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "ACTIVE",
    },
    remarks: {
        type: String,
    }
});

const PostComments = mongoose.model('PostComments', PostCommentsSchema);
module.exports = PostComments;