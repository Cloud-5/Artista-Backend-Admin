const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist-request.controller');

router.get('/', artistController.getAllArtistData);
router.get('/:userId', artistController.getArtistDetails);
router.put('/:userId/approve', artistController.approveArtist);
router.put('/:userId/reject', artistController.rejectArtist);
router.delete('/:userId', artistController.deleteAccount);

module.exports = router;

