const EmailToken = require("../models/EmailToken");

const createEmailToken = async (token, expiryDate, userId, emailActionId) => {
    await EmailToken.create({
        token,
        expiryDate,
        lastModifiedDate: Date.now(),
        userId,
        emailActionId,
    });
};

const findEmailToken = (sentToken, emailActionId) => {
    return EmailToken.findOne({
        token: sentToken,
        expiryDate: { $gt: Date.now() },
        emailActionId
    }).populate('userId');
}

module.exports = { createEmailToken, findEmailToken }