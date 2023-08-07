const User = require('../models/User.js');

const validateField = (field) => {
    return !!field;
};

const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]{3,}$/;
    return nameRegex.test(name);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateMobileNumber = (mobileNumber) => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobileNumber);
};

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

const validateUser = async (req) => {
    const {
        firstName,
        lastName,
        email,
        mobileNumber,
        username,
        password,
        isEdit,
        loggedInUserId
    } = req.body;

    const errors = [];

    if (!validateField(firstName))
        errors.push("Please enter first name.");
    else if (!validateName(firstName))
        errors.push("First name cannot contain special characters.");

    if (!validateField(lastName))
        errors.push("Please enter last name");
    else if (!validateName(lastName))
        errors.push("Last name cannot contain special characters.");

    if (!validateField(email))
        errors.push("Please enter email");
    else if (!validateEmail(email))
        errors.push("Please enter a valid email");

    if (!validateField(mobileNumber))
        errors.push("Please enter mobile number");
    else if (!validateMobileNumber(mobileNumber))
        errors.push("Please enter a valid mobile number.");

    if (!validateField(username))
        errors.push("Please enter username");
    else if (!validateUsername(username))
        errors.push("Username can only contain letters, numbers, and underscores.");

    let existingUser;
    if (!isEdit) { //case of create
        checkPasswordValidity(password, errors);
        existingUser = await User.findOne({
            $or: [
                { email: email },
                { mobileNumber: mobileNumber },
                { username: username }
            ]
        });
    } else {//case of edit
        existingUser = await User.findOne({
            $and: [
                {
                    _id: { $ne: loggedInUserId } // Exclude the logged-in user's ID
                },
                {
                    $or: [
                        { email: email },
                        { mobileNumber: mobileNumber },
                        { username: username }
                    ]
                }
            ]
        });
    }

    if (existingUser)
        errors.push("Sorry, user with given information already exists.");

    return errors;
};

const validateLoginForm = async (username, password) => {
    const errors = [];

    if (!username)
        errors.push("Mobile number, username or email address is required.");

    checkPasswordValidity(password, errors);

    return errors;
}

const checkPasswordValidity = (password, errors) => {
    if (!password)
        errors.push("Password is required.");
    else if (!validatePassword(password))
        errors.push("Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.");

    return errors;
}

const validateImage = async (imageUrl) => {
    const errors = [];

    if (!imageUrl || imageUrl.length <= 0)
        errors.push("Image is required.");
    return errors;
}

module.exports = {
    validateField,
    validateUser,
    validateLoginForm,
    checkPasswordValidity,
    validateImage
}