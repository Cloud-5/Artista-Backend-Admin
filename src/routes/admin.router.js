const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/login',adminController.login);
router.post('/forgotPasword',adminController.forgotPasword);
router.post('/resetPassword',adminController.resetPassword);

module.exports = router;