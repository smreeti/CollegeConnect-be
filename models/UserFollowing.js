const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFollowingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    followingUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Y" //Y = following, N= unfollowed
    },
    lastUpdatedDate: {
        type: Date,
        default: new Date()
    }
});

const UserFollowing = mongoose.model('UserFollowing', UserFollowingSchema);
module.exports = UserFollowing;

