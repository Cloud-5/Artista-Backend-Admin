const db = require('../utils/database');

class artistRequest {
  static getRequestedArtists() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at, profession, description FROM user WHERE role = "artist" AND is_approved = FALSE and is_rejected=FALSE');
  }

  static getRejectedArtists(){
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at, profession, description FROM user WHERE role = "artist" AND is_approved = FALSE and is_rejected=TRUE')
  }

  static getArtistsSummary() {
    return db.execute(`SELECT
    SUM(CASE WHEN is_approved = 0 AND is_rejected = 0 THEN 1 ELSE 0 END) AS total_pending_requests,
    SUM(CASE WHEN is_rejected = 1 THEN 1 ELSE 0 END) AS total_rejected_artists,
    SUM(CASE WHEN is_approved = 1 AND is_rejected = 0 THEN 1 ELSE 0 END) AS total_approved_artists
    FROM user;
    `)
  }

  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }

  static approveArtist(userId) {
    return db.execute('UPDATE user SET is_approved = TRUE, is_rejected=FALSE WHERE user_id = ?', [userId]);
  }

  static rejectArtist(userId) {
    return db.execute('UPDATE user SET is_rejected = TRUE, is_approved=FALSE WHERE user_id = ?', [userId]);
  }

  static deleteArtist(userId){
    return db.execute('DELETE FROM user WHERE user_id = ?',[userId]);
  }

  static getSocialAccounts(userId){
    return db.execute(`
        SELECT sa.*, smp.platform_name, smp.logo_url
        FROM social_accounts sa
        JOIN social_media_platforms smp ON sa.platform_id = smp.id
        WHERE sa.user_id = ?`, [userId]);
  }
}

module.exports = artistRequest;