const Dashboard = require('../services/dashboard.service');

exports.getDashboardOverview = async (req, res, next) => {
    const year = req.params.year;
    try {
        const overviewData = {};

        // Get data for dashboard overview
        overviewData.numRegisteredCustomers = await Dashboard.getNumRegisteredCustomers();
        //
        overviewData.monthlyRegistrations = await Dashboard.getMonthlyRegistrations(year);
        //
        overviewData.numUploadedCreations = await Dashboard.getNumUploadedCreations();
        overviewData.monthlyCreations = await Dashboard.getMonthlyCreations(year);
        overviewData.numApprovedArtists = await Dashboard.getNumApprovedArtists();
        //
        overviewData.monthlyApprovals = await Dashboard.getMonthlyApprovals(year);
        //
        overviewData.artCategoryDistribution = await Dashboard.getArtCategoryDistribution();
        overviewData.numRegisteredUsers = await Dashboard.getNumRegisteredUsers();
        overviewData.monthlyUserRegistrations = await Dashboard.getMonthlyUserRegistrations(year);
        overviewData.categoryPreferences = await Dashboard.getCategoryPreferences();
        overviewData.trendingArtists = await Dashboard.fetchTrendingArtists();
        overviewData.trendingArts = await Dashboard.fetchTrendingArts();
        overviewData.topCustomers = await Dashboard.fetchTopCustomers();
        res.status(200).json(overviewData);
    } catch (error) {
        console.error('Error getting dashboard overview:', error);
        next(error);
    }
};


