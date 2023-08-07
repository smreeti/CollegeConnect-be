const Post = require("../models/Post");
const CollegeInfo = require("../models/CollegeInfo");

const User = require("../models/User");
const UserType = require("../models/UserType");
const HttpStatus = require("../utils/HttpStatus");
const { setErrorResponse, setSuccessResponse } = require("../utils/Response");
const mongoose = require('mongoose');

const fetchDataForDoughnutChart = async (req, res) => {
  const loggedInUser = req.user;
  const { collegeInfoId } = req.body;
  const collegeInfo = await CollegeInfo.findById(collegeInfoId);

  const isMasterAdmin = loggedInUser.userTypeId?.code == "MASTER_ADMIN";

  if (loggedInUser.userTypeId?.code == "SUPER_ADMIN" || isMasterAdmin) {
    const regularUserType = await UserType.findOne({ code: "REGULAR_USER" });
    const adminUserType = await UserType.findOne({ code: "SUPER_ADMIN" });

    if (!regularUserType)
      return setErrorResponse(
        res,
        HttpStatus.NOT_FOUND,
        "Regular users not found"
      );

    const totalRegularUsers = await fetchTotalRegularUsers(
      collegeInfo?._id,
      regularUserType._id
    );

    const totalCollegePosts = await fetchTotalCollegePosts(
      collegeInfo?._id,
      adminUserType._id
    );

    const totalUserPosts = await fetchTotalUserPosts(
      collegeInfo?._id,
      regularUserType._id
    );

    const doughnutChartData = {
      totalRegularUsers,
      totalCollegePosts,
      totalUserPosts,
      totalPosts: totalCollegePosts + totalUserPosts,
    };

    return setSuccessResponse(res, HttpStatus.OK, doughnutChartData);
  } else {
    return setErrorResponse(
      res,
      HttpStatus.BAD_REQUEST,
      "Only admin can access this page"
    );
  }
};

const getMonthName = (monthNumber) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1] || "Unknown";
};

const fetchDataForBarChart = async (req, res) => {
  const loggedInUser = req.user;

  if (loggedInUser.userTypeId.code == "SUPER_ADMIN" || loggedInUser.userTypeId?.code == "MASTER_ADMIN") {
    try {
      // The result will be an array of objects containing the month and the total count
      // Example: [{ _id: 1, count: 10 }, { _id: 2, count: 15 }, ...]
      const totalPostsByMonth = await Post.aggregate([
        {
          $group: {
            _id: { $month: "$createdDate" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Transform the result to include month names and set count to 0 if not found
      const transformedData = Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        const monthName = getMonthName(monthNumber);
        const count =
          totalPostsByMonth.find((item) => item._id === monthNumber)?.count ||
          0;
        return { month: monthName, count };
      });

      return setSuccessResponse(res, HttpStatus.OK, transformedData);
    } catch (error) {
      console.error(error);
      return setErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        "Something went wrong"
      );
    }
  } else {
    return setErrorResponse(
      res,
      HttpStatus.BAD_REQUEST,
      "Only admin can access this page"
    );
  }
};

const fetchTotalRegularUsers = async (collegeInfoId, regularUserTypeId) => {
  const totalRegularUsers = !collegeInfoId ? await User.countDocuments({
    userTypeId: regularUserTypeId
  }) : await User.countDocuments({
    userTypeId: regularUserTypeId,
    collegeInfoId,
  });

  return totalRegularUsers;
};

const fetchTotalCollegePosts = async (collegeInfoId, adminUserTypeId) => {

  console.log(collegeInfoId)
  const query = {
    isCollegePost: "Y",
    status: "ACTIVE",
  };

  if (collegeInfoId) {
    query["postedBy.collegeInfoId"] = collegeInfoId;
  }

  if (adminUserTypeId) {
    query["postedBy.userTypeId"] = adminUserTypeId;
  }

  const totalCollegePostsCount = await Post.countDocuments(query);
  return totalCollegePostsCount;



  // try {
  //   const totalCollegePostsCount =
  //     !collegeInfoId ? await Post.countDocuments({
  //       isCollegePost: "Y",
  //       status: "ACTIVE",
  //     }).populate({
  //       path: "postedBy",
  //       match: {
  //         userTypeId: adminUserTypeId,
  //       },
  //     }) :
  //       await Post.countDocuments({
  //         isCollegePost: "Y",
  //         status: "ACTIVE",
  //       }).populate({
  //         path: "postedBy",
  //         match: {
  //           collegeInfoId: collegeInfoId,
  //           userTypeId: adminUserTypeId,
  //         },
  //       });
  //   return totalCollegePostsCount;
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
};

const fetchTotalUserPosts = async (collegeInfoId, regularUserTypeId) => {
  try {
    const totalUserPostsCount = !collegeInfoId ? await Post.countDocuments({
      isCollegePost: "N",
      status: "ACTIVE",
    }).populate({
      path: "postedBy",
      match: {
        userTypeId: regularUserTypeId,
      },
    }) : await Post.countDocuments({
      isCollegePost: "N",
      status: "ACTIVE",
    }).populate({
      path: "postedBy",
      match: {
        collegeInfoId: collegeInfoId,
      },
    });
    return totalUserPostsCount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  fetchDataForDoughnutChart,
  fetchDataForBarChart

};
