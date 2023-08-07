const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailTokenSchema = new Schema({
    token: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    lastModifiedDate: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    emailActionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailAction'
    },
});

const EmailToken = mongoose.model('EmailToken', EmailTokenSchema);

module.exports = EmailToken;

