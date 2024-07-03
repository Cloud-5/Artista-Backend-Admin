const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middlewares/verifyToken');

router.post('/login',adminController.login);
router.post('/forgotPasword',adminController.forgotPasword);
router.post('/resetPassword',adminController.resetPassword);
router.get('/admin-details/:admin_id',verifyToken,adminController.getAdminDetails);
router.put('/admin-details/:admin_id',verifyToken,adminController.updateAdminDetails);
router.put('/admin-password/:admin_id',verifyToken,adminController.updateAdminPassword);

module.exports = router;