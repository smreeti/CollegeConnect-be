const { signupUser } = require("./signupController.js");
const { fetchCollegeList } = require("./collegeInfoController.js");
const { login, verifyRefreshToken } = require("./loginController.js");
const {
  resetPassword,
  updatePassword,
} = require("./resetPasswordController.js");

const {
  savePost,
  fetchAllPosts,
  fetchPostDetails,
  deletePost,
} = require("./postController.js");

const {
  searchUserByUsername,
  fetchUserDetails,
  editProfilePhoto,
  editProfile,
  blockUser,
  deleteProfile,
  fetchAdminList,
  fetchSuperAdminList,
  fetchRegularUserList,
  fetchUserData,
} = require("./userController.js");

const { fetchProfileDetails } = require("./profileController.js");

const {
  reportPost,
  fetchPostReports,
  handleApprovePostReports,
  handleRejectPostReports,
} = require("../controllers/reportPostController.js");

const {
  fetchUserNotifications,
} = require("../controllers/userNotificationController.js");

const {
  saveComments,
  fetchPostComments,
  deleteComment,
} = require("../controllers/commentsController.js");

const {
  likeUnlikePost,
  fetchPostLikes,
} = require("../controllers/likeUnlikeController.js");

const {
  followUser,
  unfollowUser,
  fetchFollowingUsersList,
  fetchFollowersUsersList,
} = require("../controllers/userFollowingController.js");

const { reportComment } = require("../controllers/reportCommentController.js");

const {
  fetchDataForDoughnutChart,
  // fetchDataForMasterDoughnutChart,
} = require("../controllers/adminHomeController.js");

module.exports = {
  signupUser,
  fetchCollegeList,
  login,
  resetPassword,
  updatePassword,
  verifyRefreshToken,
  savePost,
  searchUserByUsername,
  fetchProfileDetails,
  fetchUserDetails,
  fetchPostDetails,
  fetchAllPosts,
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
  blockUser,
  deleteProfile,
  fetchAdminList,
  fetchSuperAdminList,
  fetchRegularUserList,
  fetchUserData,
};
