const userManagement = require('../services/user-management.service');

exports.getAllUserData = async (req, res, next) => {
  try {
    const [
      approvedArtists,
      registeredCustomers,
      deletedAccounts,
      bannedAccounts,
      userSummary
    ] = await Promise.all([
      userManagement.getApprovedArtists(),
      userManagement.getRegisteredCustomers(),
      userManagement.getDeletedAccounts(),
      userManagement.getBannedAccounts(),
      userManagement.getUserSummary()
    ]);

    const summaryData = userSummary[0][0];
    // Construct the response object
    const responseData = {
      approvedArtists: approvedArtists[0],
      registeredCustomers: registeredCustomers[0],
      deletedAccounts: deletedAccounts[0],
      bannedAccounts: bannedAccounts[0],
      totalUserRegistrations: summaryData.total_registered_users,
      totalApprovedArtists: summaryData.total_approved_artists,
      totalRegisteredCustomers: summaryData.total_registered_customers,
      totalDeletedAccounts: summaryData.total_deleted_accounts,
      totalBannedAccounts: summaryData.total_banned_accounts
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    next(error);
  }
};

exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const artistDetails = await userManagement.getArtistDetails(userId);
    res.status(200).json(artistDetails[0][0]);
  } catch (error) {
    console.error('Error getting artist details:', error);
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await userManagement.deleteUser(userId);
    res.status(200).json({ message: 'Account deleted successfully!' });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};

exports.banAccount = async (req, res, next) => {
  const userId = req.params.userId;
  const {banStartDate, banEndDate, banReason} = req.body;

  try {
    await userManagement.banUser(userId, banStartDate, banEndDate, banReason);
    res.status(200).json({ message: 'Account banned successfully!' });
  } catch (error) {
    console.error('Error banning account:', error);
    next(error);
  }
};

exports.removeBan = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await userManagement.removeBan(userId);
    res.status(200).json({ message: 'Ban removed successfully!' });
  } catch (error) {
    console.error('Error removing ban:', error);
    next(error);
  }
};

