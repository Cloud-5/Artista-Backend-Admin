const Dashboard = require('../services/dashboard.service');

exports.getDashboardOverview = async (req, res, next) => {
  try {
    const overviewData = {};

    // Get data for dashboard overview
    overviewData.numRegisteredCustomers = await getNumRegisteredCustomers();
    overviewData.monthlyRegistrations = await getMonthlyRegistrations();
    overviewData.numUploadedCreations = await getNumUploadedCreations();
    overviewData.monthlyCreations = await getMonthlyCreations();
    overviewData.numApprovedArtists = await getNumApprovedArtists();
    overviewData.monthlyApprovals = await getMonthlyApprovals();
    overviewData.artCategoryDistribution = await getArtCategoryDistribution();
    overviewData.numRegisteredUsers = await getNumRegisteredUsers();

    // Send the data in the response
    res.status(200).json(overviewData);
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    next(error);
  }
};

async function getNumRegisteredCustomers() {
  const result = await Dashboard.getNumRegisteredCustomers();
  return result[0][0].numRegisteredCustomers;
}

async function getMonthlyRegistrations() {
  const result = await Dashboard.getMonthlyRegistrations();
  return result[0];
}

async function getNumUploadedCreations() {
  const result = await Dashboard.getNumUploadedCreations();
  return result[0][0].numUploadedCreations;
}

async function getMonthlyCreations() {
  const result = await Dashboard.getMonthlyCreations();
  return result[0];
}

async function getNumApprovedArtists() {
  const result = await Dashboard.getNumApprovedArtists();
  return result[0][0].numApprovedArtists;
}

async function getMonthlyApprovals() {
  const result = await Dashboard.getMonthlyApprovals();
  return result[0];
}

async function getArtCategoryDistribution() {
  const result = await Dashboard.getArtCategoryDistribution();
  return result[0];
}

async function getNumRegisteredUsers() {
  const result = await Dashboard.getNumRegisteredUsers();
  return result[0][0].numRegisteredUsers;
}
