const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");

const {
  signupUser,
  fetchCollegeList,
  login,
  resetPassword,
  updatePassword,
  verifyRefreshToken,
  searchUserByUsername,
  fetchUserDetails,
  fetchProfileDetails,
  savePost,
  fetchAllPosts,
  fetchPostDetails,
  editProfilePhoto,
  editProfile,
  reportPost,
  fetchPostReports,
  handleApprovePostReports,
  handleRejectPostReports,
  fetchUserNotifications,
  saveComments,
  fetchPostComments,
  deleteComment,
  deletePost,
  likeUnlikePost,
  fetchPostLikes,
  followUser,
  unfollowUser,
  fetchFollowingUsersList,
  fetchFollowersUsersList,
  reportComment,
  fetchDataForDoughnutChart,
  // fetchDataForMasterDoughnutChart,
  blockUser,
  deleteProfile,
  fetchAdminList,
  fetchSuperAdminList,
  fetchRegularUserList,
  fetchUserData,
} = require("../controllers/controller.js");

const {
  API_TO_FETCH_COLLEGE_INFO,
  API_TO_SIGNUP_USER,
  API_TO_LOGIN_USER,
  API_TO_UPDATE_PASSWORD,
  API_TO_VERIFY_REFRESH_TOKEN,
  API_TO_RESET_PASSWORD,
  API_TO_SAVE_POST,
  API_TO_FETCH_ALL_POSTS,
  API_TO_SEARCH_USERS,
  API_TO_FETCH_PROFILE_DETAILS,
  API_TO_FETCH_USER_DETAILS,
  API_TO_EDIT_PROFILE_PHOTO,
  API_TO_EDIT_PROFILE,
  API_TO_FETCH_POST_DETAILS,
  API_TO_LIKE_UNLIKE_POST,
  API_TO_REPORT_POST,
  API_TO_FETCH_POST_REPORTS,
  API_TO_APPROVE_POST_REPORTS,
  API_TO_REJECT_POST_REPORTS,
  API_TO_FETCH_NOTIFICATIONS,
  API_TO_SAVE_COMMENTS,
  API_TO_FETCH_POST_COMMENTS,
  API_TO_FETCH_POST_LIKES,
  API_TO_DELETE_COMMENT,
  API_TO_DELETE_POST,
  API_TO_FOLLOW_USER,
  API_TO_UNFOLLOW_USER,
  API_TO_FETCH_FOLLOWING_USERS,
  API_TO_FETCH_FOLLOWERS,
  API_TO_REMOVE_FOLLOWERS,
  API_TO_REPORT_COMMENT,
  API_TO_APPROVE_COMMENT_REPORTS,
  API_TO_REJECT_COMMENT_REPORTS,
  API_TO_FETCH_COMMENT_REPORTS,
  API_TO_FETCH_DATA_FOR_DOUGNNUT_CHART,
  API_TO_BLOCK_USER,
  API_TO_DELETE_PROFILE,
  API_TO_FETCH_DATA_FOR_BAR_CHART,
  API_TO_FETCH_ADMIN_LIST,
  API_TO_FETCH_SUPERADMIN_LIST,
  API_TO_FETCH_REGULAR_USER_LIST,
  API_TO_FETCH_USER_DATA,
  API_TO_FETCH_DATA_FOR_MASTER_DOUGNNUT_CHART,
  API_TO_UNBLOCK_USER,
} = require("../utils/APIRequestUrl.js");

const { setSuccessResponse } = require("../utils/Response.js");
const { removeFollower } = require("../controllers/userFollowingController.js");
const {
  fetchCommentReports,
  handleApproveCommentReports,
  handleRejectCommentReports,
} = require("../controllers/reportCommentController.js");
const {
  fetchDataForBarChart, fetchDataForMasterDoughnutChart,
} = require("../controllers/adminHomeController.js");
const { unBlockUser } = require("../controllers/userController.js");

router.get(API_TO_FETCH_COLLEGE_INFO, fetchCollegeList);
router.post(API_TO_SIGNUP_USER, signupUser);

router.post(API_TO_LOGIN_USER, login);
router.post(API_TO_VERIFY_REFRESH_TOKEN, verifyRefreshToken);

//Forgot Password Requests
router.post(API_TO_RESET_PASSWORD, resetPassword); //sends token in email
router.post(API_TO_UPDATE_PASSWORD, updatePassword); //validate the token and update password

router.post("/protected", authMiddleware, (req, res) => {
  return setSuccessResponse(res, "Protected List");
});

router.post(API_TO_SAVE_POST, authMiddleware, savePost);
router.post(API_TO_FETCH_ALL_POSTS, authMiddleware, fetchAllPosts);
router.post(API_TO_DELETE_POST, authMiddleware, deletePost);

router.post(API_TO_SEARCH_USERS, authMiddleware, searchUserByUsername);
router.post(API_TO_FETCH_PROFILE_DETAILS, authMiddleware, fetchProfileDetails);

router.post(API_TO_FETCH_USER_DETAILS, authMiddleware, fetchUserDetails);
router.post(API_TO_EDIT_PROFILE_PHOTO, authMiddleware, editProfilePhoto);

router.post(API_TO_EDIT_PROFILE, authMiddleware, editProfile);

router.post(API_TO_FETCH_POST_DETAILS, authMiddleware, fetchPostDetails);

router.post(API_TO_REPORT_POST, authMiddleware, reportPost);
router.get(API_TO_FETCH_POST_REPORTS, authMiddleware, fetchPostReports);

router.post(
  API_TO_APPROVE_POST_REPORTS,
  authMiddleware,
  handleApprovePostReports
);
router.post(
  API_TO_REJECT_POST_REPORTS,
  authMiddleware,
  handleRejectPostReports
);

router.get(API_TO_FETCH_NOTIFICATIONS, authMiddleware, fetchUserNotifications);

router.post(API_TO_SAVE_COMMENTS, authMiddleware, saveComments);
router.post(API_TO_FETCH_POST_COMMENTS, authMiddleware, fetchPostComments);
router.post(API_TO_DELETE_COMMENT, authMiddleware, deleteComment);

router.put(API_TO_LIKE_UNLIKE_POST, authMiddleware, likeUnlikePost);

router.post(API_TO_FETCH_POST_LIKES, authMiddleware, fetchPostLikes);

router.post(API_TO_FOLLOW_USER, authMiddleware, followUser);
router.post(API_TO_UNFOLLOW_USER, authMiddleware, unfollowUser);

router.post(
  API_TO_FETCH_FOLLOWING_USERS,
  authMiddleware,
  fetchFollowingUsersList
);
router.post(API_TO_FETCH_FOLLOWERS, authMiddleware, fetchFollowersUsersList);
router.post(API_TO_REMOVE_FOLLOWERS, authMiddleware, removeFollower);

router.post(API_TO_REPORT_COMMENT, authMiddleware, reportComment);
router.get(API_TO_FETCH_COMMENT_REPORTS, authMiddleware, fetchCommentReports);

router.get(API_TO_FETCH_ADMIN_LIST, authMiddleware, fetchAdminList);
router.get(API_TO_FETCH_SUPERADMIN_LIST, authMiddleware, fetchSuperAdminList);

router.get(
  API_TO_FETCH_REGULAR_USER_LIST,
  authMiddleware,
  fetchRegularUserList
);

router.post(API_TO_FETCH_USER_DATA, authMiddleware, fetchUserData);

router.post(
  API_TO_APPROVE_COMMENT_REPORTS,
  authMiddleware,
  handleApproveCommentReports
);

router.post(
  API_TO_REJECT_COMMENT_REPORTS,
  authMiddleware,
  handleRejectCommentReports
);

router.post(
  API_TO_FETCH_DATA_FOR_DOUGNNUT_CHART,
  authMiddleware,
  fetchDataForDoughnutChart
);

router.get(
  API_TO_FETCH_DATA_FOR_BAR_CHART,
  authMiddleware,
  fetchDataForBarChart
);

router.post(API_TO_BLOCK_USER, authMiddleware, blockUser);
router.post(API_TO_UNBLOCK_USER, authMiddleware, unBlockUser);
router.post(API_TO_DELETE_PROFILE, authMiddleware, deleteProfile);

module.exports = router;
