require("dotenv").config();

const crypto = require("crypto");
const sendgridMail = require("@sendgrid/mail");
const HttpStatus = require("../utils/HttpStatus.js");
const {
  generateResetPasswordEmail,
} = require("../utils/EmailTemplates/ResetPassword.js");
const { fetchUser } = require("./userController.js");
const {
  setErrorResponse,
  setSuccessResponse,
} = require("../utils/Response.js");
const { fetchEmailAction } = require("./emailActionController.js");
const { RESET_PASSWORD } = require("../utils/EmailActionConstants.js");
const {
  createEmailToken,
  findEmailToken,
} = require("./emailTokenController.js");
const { checkPasswordValidity } = require("../utils/ValidationUtil.js");
const {
  generatePasswordEmail,
} = require("../utils/EmailTemplates/GeneratedPassword.js");

sendgridMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generatedPassword = generateRandomPassword();
const randomToken = crypto.randomBytes(32).toString("hex");

const resetPassword = async (req, res) => {
  try {
    const { username, loggedInUser } = req.body;
    const user = await fetchUser(username);

    if (!user)
      return setErrorResponse(res, HttpStatus.NOT_FOUND, "User not found.");

    const expiryDate = Date.now() + 3600000; // current date + 1 hour

    const emailAction = await fetchEmailAction(RESET_PASSWORD);

    await createEmailToken(randomToken, expiryDate, user._id, emailAction._id);
    if (!loggedInUser) {
      const resetPasswordEmail = generateResetPasswordEmail(
        user.username,
        user.email,
        randomToken
      );
      emailToSend = resetPasswordEmail;
      await sendEmail(emailToSend);

      return setSuccessResponse(res, "Reset Password Email Sent", emailToSend);
    } else {
      const resetPasswordEmail = generatePasswordEmail(
        user.username,
        user.email,
        randomToken,
        generatedPassword
      );
      emailToSend = resetPasswordEmail;
      await sendEmail(emailToSend);

      const resetData = {
        generatedPassword,
        randomToken
      }

      return setSuccessResponse(
        res,
        "Reset Password Email Sent",
        resetData
      );
    }
  } catch (error) {
    console.error(error.message);
    return setErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred."
    );
  }
};

function generateRandomPassword() {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const digitChars = "0123456789";

  const getRandomChar = (charSet) =>
    charSet[Math.floor(Math.random() * charSet.length)];

  const passwordLength = 8;

  let password = "";
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(digitChars);

  const remainingChars = passwordLength - 3;
  const allChars = uppercaseChars + lowercaseChars + digitChars;

  for (let i = 0; i < remainingChars; i++) {
    password += getRandomChar(allChars);
  }
  const shuffledPassword = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
}

const updatePassword = async (req, res) => {
  const { newPassword, token } = req.body;

  const errors = checkPasswordValidity(newPassword, []);
  if (errors.length > 0)
    return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

  try {
    const emailAction = await fetchEmailAction(RESET_PASSWORD);
    if (token) {
      let emailToken = await findEmailToken(token, emailAction._id);
      emailVerificationToken = emailToken;
    } else {
      let emailToken = await findEmailToken(randomToken, emailAction._id);
      emailVerificationToken = emailToken;
    }

    if (!emailVerificationToken)
      return setErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        "Try again, session expired."
      );

    const user = emailVerificationToken.userId;
    user.password = newPassword;

    emailVerificationToken.token = undefined; //reset token and expiry date
    emailVerificationToken.expiryDate = undefined;
    emailVerificationToken.lastModifiedDate = Date.now();

    emailVerificationToken = await emailVerificationToken.save();
    await user.save();

    return setSuccessResponse(res, "Password updated successfully");
  } catch (error) {
    console.log(error);
    return setErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred."
    );
  }
};

const sendEmail = async (message) => {
  await sendgridMail.send(message);
};

module.exports = { resetPassword, updatePassword };
