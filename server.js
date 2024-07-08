const express = require('express');
const bodyParser = require('body-parser');

const artCategoryRouter = require('./src/routes/art-categories.routes');
const userRouter = require('./src/routes/artist-request.routes');
const dashboardRouter = require('./src/routes/dashboard.router');
const userManagementRouter = require('./src/routes/user-management.routes');
const adminRouter = require('./src/routes/admin.router');

const errorHandler = require('./src/middlewares/errorHandler');

const {upload, deleteFromS3} = require('./src/middlewares/file-upload');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, uploadType, folder');
    next();
});

app.use('/art-categories', artCategoryRouter);
app.use('/artist-request', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/user-management', userManagementRouter);
app.use('/admin', adminRouter);

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log('req.file', req.file);
      console.log('req.headers', req.headers);
      res.json({ image: req.file });
    });
  });
  
  app.delete('/delete/:key', (req, res) => {
    const key = req.params.key;
    console.log('key', key);
  
    deleteFromS3(key, (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to delete object from S3' });
      } else {
        res.status(200).json({ message: 'Object deleted successfully' });
      }
    });
  });

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})