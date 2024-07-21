const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/:year', dashboardController.getDashboardOverview);

module.exports = router;
