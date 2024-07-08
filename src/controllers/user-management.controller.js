const userManagement = require('../services/user-management.service');
const schedule = require('node-schedule')

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
    // building the response object
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

exports.getUserDetails = async (req, res, next) => {
  const userId = req.params.userId;
  const role = req.params.role;
  console.log('userid',userId, 'role',role);

  if(role === 'artist'){
    try {
      const userDetails = await userManagement.getArtistDetails(userId);
      const socialAccounts = await userManagement.getSocialAccounts(userId);
      const rank = await userManagement.getArtistRank(userId);

      const responseData = {
        userDetails: userDetails[0][0],
        socialAccounts: socialAccounts[0],
        rank: rank[0][0]
        
      }
      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  
  } else if(role === 'customer'){
    try {

      const userDetails = await userManagement.getCustomerDetails(userId);
      const responseData = {
        userDetails: userDetails[0][0],
      }
      
      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: 'Invalid role' });
  }
};


exports.rankArtist = async(req, res, next) => {
  const artistId = req.params.userId;
  console.log('artistId',artistId);
  try {
      await userManagement.rankArtist(artistId);
      res.status(200).json({message: 'Artist Ranked Successfully!'});
  } catch (error) {
      next(error);
  }
}

exports.unrankArtist = async(req, res, next) => {
  const artistId = req.params.userId;
  try {
      await userManagement.unrankArtist(artistId);
      res.status(200).json({message: 'Artist Unranked Successfully!'});
  } catch (error) {
      next(error);
  }

}

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await userManagement.deleteUser(userId);
  } catch (error) {
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

const scheduledJob = async () => {
  try {
    const expiredBans = await userManagement.findExpiredBans();

    for (const userId of expiredBans) {
      await userManagement.removeBan(userId);
      console.log(`Ban removed for user ${userId}`);
    }
  } catch (error) {
    console.error('Error removing bans:', error);
  }
};

// schedule the job to run at 12:00 AM every day
const job = schedule.scheduleJob('0 0 * * *', scheduledJob);

