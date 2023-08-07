const CollegeInfo = require("../models/CollegeInfo.js");
const User = require("../models/User.js");
const UserType = require("../models/UserType.js");
const { BLOCK_USER } = require("../utils/EmailActionConstants.js");
const {
  generateBlockUserEmail,
} = require("../utils/EmailTemplates/BlockUser.js");
const {
  setSuccessResponse,
  setErrorResponse,
} = require("../utils/Response.js");
const { validateImage, validateUser } = require("../utils/ValidationUtil.js");
const { fetchEmailAction } = require("./emailActionController.js");
const sendgridMail = require("@sendgrid/mail");

const fetchUser = (username) => {
  const user = User.findOne({
    $or: [
      { email: username },
      { mobileNumber: username },
      { username: username },
    ],
  });
  return user ? user : null;
};

const fetchAdminUser = async (collegeId) => {
  const adminUser = await User.findOne({
    userTypeId: {
      $in: await UserType.findOne({ code: "SUPER_ADMIN" }),
    },
    collegeInfoId: collegeId,
  });

  return adminUser;
};

const fetchAdminList = async () => {
  const userType = await UserType.findOne({ code: "ADMIN" }).exec();
  if (!userType) {
    return [];
  }

  const adminUsers = await User.find({
    userTypeId: userType._id,
  });
  return adminUsers;
};

const fetchSuperAdminList = async (req, res) => {
  const { school } = req.query;
  try {
    const superAdminUserType = await UserType.findOne({
      code: "SUPER_ADMIN",
    });

    const collegeId = await CollegeInfo.findOne({
      name: school,
    });

    const superAdminUsers = await User.find({
      userTypeId: superAdminUserType._id,
      collegeInfoId: collegeId,
    });
    return setSuccessResponse(
      res,
      "Super Admin list fetched successfully",
      superAdminUsers
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const fetchRegularUserList = async (req, res) => {
  const { school } = req.query;
  try {
    const regularUserType = await UserType.findOne({
      code: "REGULAR_USER",
    });

    const collegeId = await CollegeInfo.findOne({
      name: school,
    });

    const regularUsers = await User.find({
      userTypeId: regularUserType._id,
      collegeInfoId: collegeId._id,
    });

    return setSuccessResponse(
      res,
      "Regular users fetched successfully",
      regularUsers
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.body;
    // const loggedInUser = req.user;

    let usernamePattern = new RegExp("^" + username);

    const users = await User.find({
      username: { $regex: usernamePattern },
      // collegeInfoId: loggedInUser.collegeInfoId,
    }).select("username profilePicture firstName lastName collegeInfoId");

    if (users.length === 0)
      return setErrorResponse(res, HttpStatus.NOT_FOUND, "No user(s) found.");

    return setSuccessResponse(res, "Users fetched successfully", users);
  } catch (e) {
    return setErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while fetching users."
    );
  }
};

const fetchUserMinDetails = async (id) => {
  const userDetail = await User.findById(id).select(
    "firstName lastName username profilePicture bio followers following"
  );
  return userDetail;
};

const fetchUserDetails = async (req, res) => {
  const loggedInUser = req.user;
  try {
    const userDetail = await User.findOne({
      _id: loggedInUser._id,
    }).populate("collegeInfoId");

    userDetail.password = undefined;
    return setSuccessResponse(
      res,
      "User detail fetched successfully",
      userDetail
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const fetchUserData = async (req, res) => {
  const { id } = req.body;
  try {
    const [userDetail] = await User.find({
      _id: id,
    }).populate({ path: "collegeInfoId", select: "name" });

    userDetail.password = undefined;

    return setSuccessResponse(
      res,
      "User detail fetched successfully",
      userDetail
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const editProfilePhoto = async (req, res) => {
  const { imageUrl, id } = req.body;

  const loggedInUser = id ? { _id: id } : req.user;

  try {
    let errors = await validateImage(imageUrl);
    if (errors.length > 0)
      return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      {
        profilePicture: imageUrl,
      },
      { new: true }
    );
    return setSuccessResponse(
      res,
      { message: "Profile picture saved successfully" },
      user
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const editProfile = async (req, res) => {
  const { firstName, lastName, email, mobileNumber, username, bio, id } =
    req.body;
  const loggedInUser = id ? { _id: id } : req.user;

  req.body.isEdit = true;
  req.body.loggedInUserId = loggedInUser._id;

  try {
    const errors = await validateUser(req);

    if (errors.length > 0)
      return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      {
        firstName,
        lastName,
        email,
        mobileNumber,
        username,
        bio,
      },
      { new: true }
    );

    return setSuccessResponse(
      res,
      { message: "Profile updated successfully" },
      user
    );
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const blockUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        status: "BLOCKED",
      },
      { new: true }
    );

    const blockUserEmail = generateBlockUserEmail(
      user.username,
      user.email,
      "cdvs"
    );
    await sendEmail(blockUserEmail);

    return setSuccessResponse(res, { message: "User blocked successfully" });
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const unBlockUser = async (req, res) => {
  const { userId } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        status: "ACTIVE",
      },
      { new: true }
    );

    return setSuccessResponse(res, { message: "User unblocked successfully" });
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const deleteProfile = async (req, res) => {
  const { userId } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        status: "DELETED",
      },
      { new: true }
    );

    return setSuccessResponse(res, { message: "User deleted successfully" });
  } catch (error) {
    return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const sendEmail = async (message) => {
  await sendgridMail.send(message);
};

module.exports = {
  fetchUser,
  fetchAdminUser,
  searchUserByUsername,
  fetchUserMinDetails,
  fetchUserDetails,
  editProfilePhoto,
  editProfile,
  blockUser,
  deleteProfile,
  fetchAdminList,
  fetchSuperAdminList,
  fetchRegularUserList,
  fetchUserData,
  unBlockUser
};
