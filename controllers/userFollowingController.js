const User = require("../models/User");
const UserFollowing = require("../models/UserFollowing");
const { setSuccessResponse, setErrorResponse } = require('../utils/Response.js');

const fetchFollowingUsers = async (userId) => {
    return await UserFollowing.find({ userId: userId, status: 'Y' }).distinct('followingUserId');
}

const followUser = async (req, res) => {
    const loggedInUser = req.user;
    const { followingUserId } = req.body;

    try {
        const user = await User.findById(followingUserId);
        if (user) {
            await UserFollowing.create({
                userId: loggedInUser,
                followingUserId: user
            });

            await incrementUserFollowingCount(loggedInUser._id); //increment following count for the logged in user
            await incrementUserFollowerCount(user._id); //logged in user is following other user so increment the other users followers count
            return setSuccessResponse(res, "Successfully followed: " + user.username);
        }
    } catch (e) {
        return setErrorResponse(res, "Something went wrong");
    }
}

const incrementUserFollowingCount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { following: 1 }
    });
}

const incrementUserFollowerCount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { followers: 1 }
    });
}

const decrementUserFollowingCount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { following: -1 }
    });
}

const decrementUserFollowerCount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { followers: -1 }
    });
}

const checkIfFollowing = async (userId, followingUserId) => {
    const result = await UserFollowing.findOne({
        userId: userId,
        followingUserId: followingUserId
    });
    return result !== null;
};

const unfollowUser = async (req, res) => {
    const loggedInUser = req.user;
    const followingUserId = req.params.followingUserId;

    try {
        const followingUser = await User.findById(followingUserId);
        if (followingUser) {
            const query = {
                userId: loggedInUser,
                followingUserId: followingUser
            };
            await UserFollowing.findOneAndDelete(query);

            await decrementUserFollowingCount(loggedInUser._id); //decrement following count for the logged in user
            await decrementUserFollowerCount(followingUser._id); //logged in user is unfollowing other user so decrement the other users followers count
        }

        return setSuccessResponse(res, "Successfully unfollowed: " + followingUser.username);
    } catch (e) {
        return setErrorResponse(res, "Something went wrong");
    }
}

const removeFollower = async (req, res) => {
    const loggedInUser = req.user;
    const followerUserId = req.params.followerUserId;

    try {
        const followerUser = await User.findById(followerUserId);

        if (followerUser) {
            const query = {
                userId: followerUser,
                followingUserId: loggedInUser
            };
            await UserFollowing.findOneAndDelete(query);

            await decrementUserFollowingCount(followerUser._id); //decrement following count for the logged in user
            await decrementUserFollowerCount(loggedInUser._id); //logged in user is unfollowing other user so decrement the other users followers count
        }

        return setSuccessResponse(res, "Successfully unfollowed: " + loggedInUser.username);
    } catch (e) {
        return setErrorResponse(res, "Something went wrong");
    }
}

const fetchFollowingUsersList = async (req, res) => {
    try {
        const followingUsers = await UserFollowing.find(
            {
                userId: req.params.userId,
                status: 'Y'
            })
            .populate({
                path: "followingUserId",
                select: "username profilePicture firstName lastName"
            });
        return setSuccessResponse(res, "Successfully fetched following users: ", { followingUsers });
    } catch (e) {
        return setErrorResponse(res, "Something went wrong");
    }
}

const fetchFollowersUsersList = async (req, res) => {

    try {
        const followers = await UserFollowing.find(
            { followingUserId: req.params.userId, status: 'Y' })
            .populate({
                path: "userId",
                select: "username profilePicture firstName lastName"
            });
        return setSuccessResponse(res, "Successfully fetched followers: ", { followers });
    } catch (e) {
        return setErrorResponse(res, "Something went wrong");
    }
}

module.exports = {
    fetchFollowingUsers,
    followUser,
    checkIfFollowing,
    unfollowUser,
    incrementUserFollowingCount,
    incrementUserFollowerCount,
    fetchFollowingUsersList,
    fetchFollowersUsersList,
    removeFollower
};