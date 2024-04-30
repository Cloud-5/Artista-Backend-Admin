// dashboard.service.js
const db = require("../utils/database");

class Dashboard {
  static async getNumRegisteredCustomers() {
    const result = await db.execute(
      'SELECT COUNT(*) as numRegisteredCustomers FROM user WHERE role = "customer"'
    );
    return result[0][0].numRegisteredCustomers;
  }

  static async getMonthlyRegistrations() {
    const result = await db.execute(`
            SELECT DATE_FORMAT(registered_at, '%Y-%m') AS registrationMonth,
                   COUNT(*) AS registrationsCount
            FROM user
            WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY registrationMonth;
        `);
    return result[0].map((row) => row.registrationsCount);
  }

  static async getNumUploadedCreations() {
    const result = await db.execute(
      "SELECT COUNT(*) AS numUploadedCreations FROM artwork"
    );
    return result[0][0].numUploadedCreations;
  }

  static async getMonthlyCreations() {
    const result = await db.execute(`
            SELECT DATE_FORMAT(published_date, '%Y-%m') AS publicationMonth,
                   COUNT(*) AS creationsCount
            FROM artwork
            WHERE published_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY publicationMonth;
        `);
    return result[0].map((row) => row.creationsCount);
  }

  static async getNumApprovedArtists() {
    const result = await db.execute(
      'SELECT COUNT(*) AS numApprovedArtists FROM user WHERE role = "artist" AND is_approved = TRUE'
    );
    return result[0][0].numApprovedArtists;
  }

  static async getMonthlyApprovals() {
    const result = await db.execute(`
            SELECT DATE_FORMAT(registered_at, '%Y-%m') AS approvalMonth,
                   COUNT(*) AS approvalsCount
            FROM user
            WHERE role = 'artist' AND is_approved = TRUE AND registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY approvalMonth;
        `);
    return result[0].map((row) => row.approvalsCount);
  }

  static async getNumRegisteredUsers() {
    const result = await db.execute(`
            SELECT COUNT(*) AS numRegisteredUsers
            FROM user
            WHERE role IN ('customer', 'artist') AND (is_approved = TRUE OR role = 'customer');
        `);
    return result[0][0].numRegisteredUsers;
  }

  static async getArtCategoryDistribution() {
    const result = await db.execute(`
            SELECT c.name AS categoryName,
                   COUNT(*) AS creationsCount
            FROM artwork a
            JOIN category c ON a.category_id = c.category_id
            GROUP BY categoryName;
        `);
    return result[0].map((row) => [row.categoryName, row.creationsCount]);
  }

  static async getMonthlyUserRegistrations() {
    const result = await db.execute(`
            SELECT DATE_FORMAT(registered_at, '%Y-%m') AS registrationMonth,
                   COUNT(*) AS registrationsCount
            FROM user
            WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY registrationMonth;
        `);
    return result[0].map((row) => row.registrationsCount);
  }

  static async getCategoryPreferences() {
    const result = await db.execute(`
      SELECT 
      c.name AS categoryName,
      CAST(SUM(IFNULL(al.likes, 0)) AS UNSIGNED) AS totalLikes,
      CAST(SUM(IFNULL(cmt.comments, 0)) AS UNSIGNED) AS totalComments
  FROM 
      category c
  LEFT JOIN (
      SELECT 
          a.category_id, 
          COUNT(*) AS likes
      FROM 
          artwork_like al
      JOIN 
          artwork a ON al.artwork_id = a.artwork_id
      GROUP BY 
          a.category_id
  ) al ON c.category_id = al.category_id
  LEFT JOIN (
      SELECT 
          a.category_id, 
          COUNT(*) AS comments
      FROM 
          comment cmt
      JOIN 
          artwork a ON cmt.artwork_id = a.artwork_id
      GROUP BY 
          a.category_id
  ) cmt ON c.category_id = cmt.category_id
  GROUP BY 
      c.category_id;
  
      `);

    const categories = [];
    const series = [
      { name: "Likes", data: [] },
      { name: "Comments", data: [] },
    ];

    result[0].forEach((row) => {
      categories.push(row.categoryName);
      series[0].data.push(row.totalLikes);
      series[1].data.push(row.totalComments);
    });

    return { categories, series };
  }
}

module.exports = Dashboard;
