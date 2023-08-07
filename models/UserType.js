const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

const UserTypeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide user type name'],
        unique: true
    },
    code: {
        type: String,
        required: [true, 'Please provide user type code'],
        unique: true
    }
});

UserTypeSchema.plugin(uniqueValidator);

const UserType = mongoose.model('UserType', UserTypeSchema);

module.exports = UserType;

