const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/user-management.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/',verifyToken, userManagementController.getAllUserData);
router.get('/:userId/:role',verifyToken, userManagementController.getUserDetails);
router.delete('/:userId',verifyToken, userManagementController.deleteAccount);
router.put('/ban/:userId',verifyToken, userManagementController.banAccount);
router.put('/remove-ban/:userId',verifyToken, userManagementController.removeBan);
router.put('/rank/:userId',verifyToken, userManagementController.rankArtist);
router.put('/unrank/:userId',verifyToken, userManagementController.unrankArtist);


module.exports = router;
