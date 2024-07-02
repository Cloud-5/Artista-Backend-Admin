const db = require('../utils/database');

class userManagement {
  static getApprovedArtists() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at, profession FROM user WHERE role = "artist" AND is_approved = TRUE and is_rejected=FALSE and isBanned=FALSE and isActive=TRUE');
  }

  static getRegisteredCustomers() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "customer" and isActive=TRUE and isBanned=FALSE');
  }

  static getDeletedAccounts() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE isActive=FALSE');
  }

  static getBannedAccounts() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE isBanned=TRUE and isActive=TRUE');
  }

  static getUserSummary() {
    return db.execute(`
    SELECT
        SUM(CASE WHEN role = 'artist' AND is_approved = TRUE AND is_rejected = FALSE AND isBanned = FALSE AND isActive = TRUE THEN 1 ELSE 0 END) AS total_approved_artists,
        SUM(CASE WHEN role = 'customer' AND isActive = TRUE AND isBanned = FALSE THEN 1 ELSE 0 END) AS total_registered_customers,
        SUM(CASE WHEN isActive = FALSE THEN 1 ELSE 0 END) AS total_deleted_accounts,
        SUM(CASE WHEN isBanned = TRUE AND isActive = TRUE THEN 1 ELSE 0 END) AS total_banned_accounts,
        SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) + SUM(CASE WHEN role = 'artist' AND is_approved = TRUE THEN 1 ELSE 0 END) AS total_registered_users
    FROM user`)
    
  }

  static banUser(userId, banStartDate, banEndDate, banReason) {
    return db.execute('UPDATE user SET isBanned = TRUE, ban_start_date = ?, ban_end_date = ?, ban_reason = ? WHERE user_id = ?', [banStartDate, banEndDate, banReason, userId]);
  }

  static removeBan(userId) {
    return db.execute('UPDATE user SET isBanned = FALSE, ban_reason = NULL,ban_start_date = NULL, ban_end_date = NULL  WHERE user_id = ?', [userId]);
  }


  static deleteUser(userId) {
    return db.execute('UPDATE user SET isActive = FALSE WHERE user_id = ?', [userId]);
  }
  
  static getArtistDetails(userId) {
    return db.execute('CALL GetArtistDetails(?);', [userId]);
  }

  static getCustomerDetails(userId) {
    return db.execute('CALL GetCustomerDetails(?);',[userId]);
  }

  static getSocialAccounts(userId){
    return db.execute(`CALL GetSocialAccounts(?);`, [userId]);
  }

  static getUserSummery(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }

  static async findExpiredBans() {
    try {
      const [rows] = await db.execute(
        'SELECT user_id FROM user WHERE isBanned = TRUE AND ban_end_date < NOW()'
      );

      const expiredBans = rows.map(row => row.user_id);
      console.log('expired',expiredBans);

      return expiredBans;
    } catch (error) {
      console.error('Error finding expired bans:', error);
      throw error;
    }
  }

}

module.exports = userManagement;