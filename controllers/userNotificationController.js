const UserNotification = require("../models/UserNotifications");
const { setErrorResponse, setSuccessResponse } = require("../utils/Response");

const saveUserNotification = async (userNotification) => {
    const { remarks, post, user, subject } = userNotification;

    await UserNotification.create({
        remarks,
        subject,
        post,
        user
    })
}

const fetchUserNotifications = async (req, res) => {
    try {
        const userNotifications = await UserNotification.find({
            user: req.user
        })
            .populate({
                path: 'post',
                populate: { path: 'postedBy' }
            })
            .sort({ notificationDate: -1 });
        return setSuccessResponse(res, "Notifications fetched", userNotifications);
    } catch (error) {
        return setErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}

module.exports = { saveUserNotification, fetchUserNotifications };