const { setSuccessResponse, setErrorResponse } = require('../utils/Response');
const { fetchUserPosts } = require('./postController.js');
const { fetchUserMinDetails } = require('./userController.js');
const { checkIfFollowing } = require('./userFollowingController');

const fetchProfileDetails = async (req, res) => {
    const { id } = req.body;
    const loggedInUser = req.user;

    const userDetail = await fetchUserMinDetails(id);
    const posts = await fetchUserPosts(id);
    const isFollowing = await checkIfFollowing(loggedInUser._id, id);

    if (userDetail)
        return setSuccessResponse(res, "Posts fetched successfully", {
            userDetail,
            posts,
            isFollowing
        });
    else
        return setErrorResponse(res, HttpStatus.NOT_FOUND, "No user found.");
}

module.exports = { fetchProfileDetails }