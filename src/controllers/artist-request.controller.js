const artistRequest = require('../services/artist-request.service')


exports.getAllArtistData = async (req, res, next) => {
  try {
    // Fetch requested artists
    const requestedArtists = await artistRequest.getRequestedArtists();

    // Fetch rejected artists
    const rejectedArtists = await artistRequest.getRejectedArtists();

    // Fetch artists summary data
    const artistsSummary = await artistRequest.getArtistsSummary();

    // Extract summary data from the result
    const summaryData = artistsSummary[0][0];

    // Combine all data into a single object
    const responseData = {
      requestedArtists: requestedArtists[0],
      rejectedArtists: rejectedArtists[0],
      totalPendingRequests: summaryData.total_pending_requests,
      totalRejectedArtists: summaryData.total_rejected_artists,
      totalApprovedArtists: summaryData.total_approved_artists
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching artist data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const artistDetails = await artistRequest.getArtistDetails(userId);
    res.status(200).json(artistDetails[0][0]);
  } catch (error) {
    console.error('Error getting artist details:', error);
    next(error);
  }
};

exports.approveArtist = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistRequest.approveArtist(userId);
    res.status(200).json({ message: 'Artist approved successfully!' });
  } catch (error) {
    console.error('Error approving artist:', error);
    next(error);
  }
};

exports.rejectArtist = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistRequest.rejectArtist(userId);
    res.status(200).json({ message: 'Artist rejected successfully!' });
  } catch (error) {
    console.error('Error rejecting artist:', error);
    next(error);
  }

}

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistRequest.deleteArtist(userId);
    res.status(200).json({ message: 'Account deleted successfully!' });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};


