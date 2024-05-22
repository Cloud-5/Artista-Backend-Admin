const adminService = require("../services/admin.service");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
const schema = new passwordValidator();

const tokengenerator = require("../middlewares/createToken");

schema
  .is()
  .min(8)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .symbols(1);

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("in controller email and pwd", email, password);
    const admin = await adminService.loginUser(email);

    if (admin[0][0].length === 0) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    if (admin[0][0].password !== password) {
        return res.status(401).json({ message: "Password is incorrect" });
    }

    if (admin[0][0].password === password){
        const response = { email: admin[0][0].email };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        return res
      .status(200)
      .json({ message: "Successful Login", accessToken: accessToken });
    }
    
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.forgotPasword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("comming mail", email);

    const existingAdmin = await adminService.checkExistingEmail(email);
    console.log(existingAdmin[0][0].email);

    if (existingAdmin[0].length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // console.log(existingUser[0][0])
    try {
      // console.log("Here")
      const token = tokengenerator({ email: existingAdmin[0][0].email });
      // console.log(token)

      const link =
        "http://" + req.hostname + ":4200/reset-password?token=" + token;
      // console.log(link)

      const sendMail = await adminService.sendForgotPasswordEmail(
        existingAdmin[0][0].email,
        link
      );

      await adminService.forgotPasword(email, existingAdmin[0][0].password);
      return res.status(200).json({ message: "Forgot Password email send" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;
    console.log("in reset password", email, newPassword, confirmNewPassword);
  if (!newPassword || !confirmNewPassword || !email) {
    return res
      .status(401)
      .json({ success: false, msg: "Please fill in all the fields" });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter a valid email" });
  }
  const existingAdmin = await adminService.checkExistingEmail(email);

  if (!existingAdmin) {
    return res.status(400).json({ success: false, msg: "User not found" });
  }

  if (
    newPassword.length < 8 &&
    ![A - Z].test(newPassword) &&
    ![a - z].test(newPassword) &&
    ![0 - 9].test(newPassword) &&
    !/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
  ) {
    return res.status(400).json({
      success: false,
      msg: "Please enter a valid password with at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ success: false, msg: "Passwords do not match" });
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  console.log("hashed password", hashedPassword);

  const updatedData = await adminService.updateUserPassword(hashedPassword,email);
    console.log("updated data", updatedData);

  if (updatedData) {
    return res
      .status(200)
      .json({ success: true, msg: "Password updated successfully" });
  } else {
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong" });
  }
};
