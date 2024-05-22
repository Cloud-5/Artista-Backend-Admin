const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    //acl: 'public-read',
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      // using Date.now() to make sure my file has a unique name
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
    }  
  })
});


//deleting function for one file
const deleteFromS3 = (key, callback) => {
  const params = {
    Bucket: "test-artista",
    Key: key
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Error deleting object:', err);
      callback(err);
    } else {
      console.log('Object deleted successfully');
      callback(null, data);
    }
  });
}

module.exports = { upload, deleteFromS3 };
