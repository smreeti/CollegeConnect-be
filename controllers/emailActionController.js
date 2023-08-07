const EmailAction = require('../models/EmailAction.js');

const fetchEmailAction = (code) => {
    const emailAction = EmailAction.findOne({ code: code });
    return emailAction ? emailAction : null;
}

module.exports = { fetchEmailAction };