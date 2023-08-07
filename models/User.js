const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
let uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    firstName: {
        type: String,
        default: 'default',
        required: [true, 'Please provide first name']
    },
    lastName: {
        type: String,
        default: 'default',
        required: [true, 'Please provide last name']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Please provide mobile number'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please provide username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
    },
    profilePicture: {
        type: String,
        default: 'default'
    },
    userTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType'
    },
    collegeInfoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollegeInfo'
    },
    bio: {
        type: String
    },
    following: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'ACTIVE'
    }
});

UserSchema.pre('save', function (next) {
    const user = this;

    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    })
})

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = User;

