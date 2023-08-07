const CollegeInfo = require('../models/CollegeInfo.js');
const HttpStatus = require('../utils/HttpStatus.js');
const { setSuccessResponse, setErrorResponse } = require('../utils/Response.js');

const fetchCollegeList = async (req, res) => {
    try {
        const collegeList = await CollegeInfo.find();
        return setSuccessResponse(res, "College Info List fetched successfully", collegeList);
    } catch (error) {
        return setErrorResponse(res, HttpStatus.NOT_FOUND, "Error fetching college list");
    }
};

const fetchCollegeById = async (collegeInfoId) => {
    await CollegeInfo.findById(collegeInfoId);
}

module.exports = { fetchCollegeList, fetchCollegeById };