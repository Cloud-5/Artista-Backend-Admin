const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/user-management.controller');

router.get('/', userManagementController.getAllUserData);
router.get('/:userId', userManagementController.getArtistDetails);
router.delete('/:userId', userManagementController.deleteAccount);
router.put('/ban/:userId', userManagementController.banAccount);
router.put('/remove-ban/:userId', userManagementController.removeBan);


module.exports = router;
