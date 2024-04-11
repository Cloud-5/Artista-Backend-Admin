const db = require('../utils/database');

class Dashboard {

    static getNumRegisteredCustomers() {
        return db.execute('SELECT COUNT(*) as numRegisteredCustomers FROM user WHERE role = "customer"');
    }

    static getMonthlyRegistrations() {
        return db.execute(`
          SELECT DATE_FORMAT(registered_at, '%Y-%m') AS registrationMonth,
                 COUNT(*) AS registrationsCount
          FROM user
          WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY registrationMonth;
        `);
    }

    static getNumUploadedCreations() {
        return db.execute('SELECT COUNT(*) AS numUploadedCreations FROM artwork');
    }
    
      static getMonthlyCreations() {
        return db.execute(`
          SELECT DATE_FORMAT(published_date, '%Y-%m') AS publicationMonth,
                 COUNT(*) AS creationsCount
          FROM artwork
          WHERE published_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY publicationMonth;
        `);
    }

    static getNumApprovedArtists() {
        return db.execute('SELECT COUNT(*) AS numApprovedArtists FROM user WHERE role = "artist" AND is_approved = TRUE');
      }
    
      static getMonthlyApprovals() {
        return db.execute(`
          SELECT DATE_FORMAT(registered_at, '%Y-%m') AS approvalMonth,
                 COUNT(*) AS approvalsCount
          FROM user
          WHERE role = 'artist' AND is_approved = TRUE AND registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY approvalMonth;
        `);
      }

      static getNumRegisteredUsers() {
        return db.execute(`
          SELECT COUNT(*) AS numRegisteredUsers
          FROM user
          WHERE role IN ('customer', 'artist') AND (is_approved = TRUE OR role = 'customer');
        `);
      }

      static getArtCategoryDistribution() {
        return db.execute(`
          SELECT c.name AS categoryName,
                 COUNT(*) AS creationsCount
          FROM artwork a
          JOIN category c ON a.category_id = c.category_id
          GROUP BY categoryName;
        `);
      };

};

module.exports = Dashboard;