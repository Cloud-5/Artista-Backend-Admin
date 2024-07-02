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
    return db.execute('select email, password, admin_id from admins where email=?', [email])
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


  exports.getAdminDetails = (admin_id) => {
    return db.execute('select admin_id, name, email, profile_photo,password from admins where admin_id=?', [admin_id]);
  };

  exports.updateAdminDetails = (name, email, profile_photo, admin_id) => {
    return db.execute('update admins set name=?, email=?, profile_photo=? where admin_id=?', [name, email, profile_photo, admin_id]);
  }

  exports.updateAdminPassword = (password, admin_id) => {
    return db.execute('update admins set password=? where admin_id=?', [password, admin_id]);
  }

  
