const db = require('../utils/database');
const transporter = require('../middlewares/nodemailer');

exports.checkExistingEmail = (email) => {
    return db.execute('select * from admins where email=?', [email]);
};

exports.updateUserPassword = (password, email) => {
    console.log("password",password,'email',email);
    return db.execute('update admins set password=? where email=?', [password, email]);
}

exports.loginUser = (email) => {
    return db.execute('select email, password from admins where email=?', [email])
}
exports.forgotPasword = async (email,link) => {
    let error= false;
    try {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Artista - Reset Password',
        html: link,
    });
}catch (e) {
    error = true;
  }

  return error;
};

exports.sendForgotPasswordEmail = async (senderAddress, link) => {
    let error = false;
    console.log("LINK",link);

    try {
      await transporter.sendMail({
        from:  process.env.SMTP_USER,
        to: senderAddress,
        subject: "New Password",
        html: `Please reset your password by clicking <a href="${link}">here</a>.<br>This email is valid for two days.`,
      });
    } catch (e) {
      error = true;
    }
  
    return error;
  };