const Dashboard = require('../services/dashboard.service');

exports.getDashboardOverview = async (req, res, next) => {
    try {
        const overviewData = {};

        // Get data for dashboard overview
        overviewData.numRegisteredCustomers = await Dashboard.getNumRegisteredCustomers();
        overviewData.monthlyRegistrations = await Dashboard.getMonthlyRegistrations();
        overviewData.numUploadedCreations = await Dashboard.getNumUploadedCreations();
        overviewData.monthlyCreations = await Dashboard.getMonthlyCreations();
        overviewData.numApprovedArtists = await Dashboard.getNumApprovedArtists();
        overviewData.monthlyApprovals = await Dashboard.getMonthlyApprovals();
        overviewData.artCategoryDistribution = await Dashboard.getArtCategoryDistribution();
        overviewData.numRegisteredUsers = await Dashboard.getNumRegisteredUsers();
        overviewData.monthlyUserRegistrations = await Dashboard.getMonthlyUserRegistrations();
        overviewData.categoryPreferences = await Dashboard.getCategoryPreferences();

        res.status(200).json(overviewData);
    } catch (error) {
        console.error('Error getting dashboard overview:', error);
        next(error);
    }
};


