const User = require("../models/User.js");
const UserType = require("../models/UserType.js");
const CollegeInfo = require("../models/CollegeInfo.js");
const HttpStatus = require("../utils/HttpStatus.js");
const {
  setSuccessResponse,
  setErrorResponse,
} = require("../utils/Response.js");

const { validateUser } = require("../utils/ValidationUtil.js");
const { fetchAdminUser } = require("./userController.js");
const UserFollowing = require("../models/UserFollowing.js");
const { incrementUserFollowingCount, incrementUserFollowerCount } = require("./userFollowingController.js");

const signupUser = async (req, res) => {
  const {
    collegeInfoId,
    firstName,
    lastName,
    email,
    mobileNumber,
    username,
    password,
    userType
  } = req.body;
  req.body.isEdit = false;

  const errors = await validateUser(req);
  const collegeInfo = await fetchCollegeInfo(collegeInfoId, errors);
  const userTypeId = await fetchUserType(userType);

  if (errors.length > 0)
    return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

  try {
    const createdUser = await User.create({
      collegeInfoId: collegeInfo,
      userTypeId,
      firstName,
      lastName,
      email,
      mobileNumber,
      username,
      password,
    });

    const savedUserId = createdUser._id;
    await followCollegeAdmin(savedUserId, collegeInfoId);

    return setSuccessResponse(res, { message: "User saved successfully" });
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const followCollegeAdmin = async (userId, collegeInfoId) => {
  const adminUser = await fetchAdminUser(collegeInfoId);

  if (adminUser) {
    await UserFollowing.create({
      userId,
      followingUserId: adminUser
    })

    await incrementUserFollowingCount(userId); //increment following count for the user
    await incrementUserFollowerCount(adminUser._id); // user is following superadmin so increment the superadmin followers count
  }
}

const fetchCollegeInfo = async (collegeInfoId, errors) => {
  let collegeInfo;
  try {
    collegeInfo = await CollegeInfo.findById(collegeInfoId);
    if (!collegeInfo) errors.push("College info not found");
  } catch (error) {
    errors.push("Error finding college info");
  }
  return collegeInfo;
};

const fetchUserType = async (userType) => {
  const userTypeId = await UserType.findOne({ code: userType });
  if (!userTypeId) errors.push("User type not found");
  return userTypeId;
};

module.exports = { signupUser };
