const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

const CollegeInfoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide college name'],
        unique: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Please provide mobile number'],
        unique: true
    },
    city: {
        type: String,
        required: [true, 'Please provide city']
    },
    address: {
        type: String,
        required: [true, 'Please provide address'],
    },
    postalCode: {
        type: String,
        required: [true, 'Please provide postal code'],
    },
    imageUrl:{
        type: String
    }
});

CollegeInfoSchema.plugin(uniqueValidator);

const CollegeInfo = mongoose.model('CollegeInfo', CollegeInfoSchema);

module.exports = CollegeInfo;

