const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

const EmailActionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        unique: true
    },
    code: {
        type: String,
        required: [true, 'Please provide code'],
        unique: true
    }
});

EmailActionSchema.plugin(uniqueValidator);

const EmailAction = mongoose.model('EmailAction', EmailActionSchema);

module.exports = EmailAction;

