const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist-request.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', artistController.getAllArtistData);
router.get('/:userId',verifyToken, artistController.getArtistDetails);
router.put('/:userId/approve',verifyToken, artistController.approveArtist);
router.put('/:userId/reject',verifyToken, artistController.rejectArtist);
router.delete('/:userId',verifyToken, artistController.deleteAccount);

module.exports = router;

