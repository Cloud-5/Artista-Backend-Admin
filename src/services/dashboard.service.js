// dashboard.service.js
const db = require("../utils/database");

class Dashboard {
  static async getNumRegisteredCustomers() {
    const result = await db.execute(
      'SELECT COUNT(*) as numRegisteredCustomers FROM user WHERE role = "customer"'
    );
    return result[0][0].numRegisteredCustomers;
  }

  static async getMonthlyRegistrations(year) {
    const result = await db.execute(`
            CALL GetMonthlyRegistrations(?);
        `,[year]);
    return result[0][0];
  }

  static async getNumUploadedCreations() {
    const result = await db.execute(
      "SELECT COUNT(*) AS numUploadedCreations FROM artwork"
    );
    return result[0][0].numUploadedCreations;
  }

  static async getMonthlyCreations(year) {
    const result = await db.execute(`
            call getMonthlyCreation(?);
        `,[year]);
    return result[0][0];
  }

  static async getNumApprovedArtists() {
    const result = await db.execute(
      'SELECT COUNT(*) AS numApprovedArtists FROM user WHERE role = "artist" AND is_approved = TRUE'
    );
    return result[0][0].numApprovedArtists;
  }

  static async getMonthlyApprovals(year) {
    const result = await db.execute(`
            CALL getMonthlyApprovals(?);
        `,[year]);
    return result[0][0];
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

  static fetchTrendingArtists() {
    return db.execute(
      ` SELECT 
    u.*,
    COALESCE(COUNT(DISTINCT af.follower_user_id), 0) AS total_followers,
    MIN(af.follow_date) AS first_follow_date,
    MAX(af.follow_date) AS last_follow_date,
    DATEDIFF(MAX(af.follow_date), MIN(af.follow_date)) AS days_to_reach,
	COALESCE(AVG(ar.rating_value), 0) AS rating,
    COALESCE(COUNT(DISTINCT a.artwork_id), 0) AS total_artworks
FROM 
    artist_follower af
JOIN
    user u ON af.followed_artist_user_id = u.user_id
LEFT JOIN
    artist_rating ar ON ar.rated_user_id = u.user_id
LEFT JOIN
    artwork a ON a.artist_id = u.user_id AND a.availability = 1
WHERE
    u.is_rejected = FALSE AND
    u.isBanned = FALSE AND
    u.isActive = TRUE
GROUP BY 
    af.followed_artist_user_id
ORDER BY
    total_followers DESC,
    days_to_reach ASC
LIMIT 20;

`
    );
  }

  static fetchTrendingArts() {
    return db.execute(
      `SELECT 
    a.artwork_id,
    a.title AS artwork_name,
    a.price AS artwork_price,
    CONCAT(u.fName, ' ', u.LName) AS artist_name,
    a.thumbnail_url AS artwork_image_url,
    COUNT(al.artwork_id) AS total_likes,
    MIN(al.liked_at) AS first_like_time,
    MAX(al.liked_at) AS last_like_time,
    TIMESTAMPDIFF(SECOND, MIN(al.liked_at), MAX(al.liked_at)) AS like_time_span
FROM 
    artwork a
JOIN 
    artwork_like al ON a.artwork_id = al.artwork_id
JOIN 
    user u ON a.artist_id = u.user_id
WHERE
    a.availability = 1
GROUP BY 
    a.artwork_id, artwork_name, artist_name, artwork_price, a.thumbnail_url
ORDER BY 
    total_likes DESC,
    like_time_span ASC
LIMIT 20;
`
    );
  }

  static fetchTopCustomers(){
    return db.execute(
      `SELECT 
    u.username,
    u.user_id,
    u.role,
    u.location,
    u.profile_photo_url,
    COALESCE(COUNT(DISTINCT al.artwork_id), 0) AS total_likes,
    COALESCE(COUNT(DISTINCT al.artwork_id) * 1, 0) AS likes_mark,
    COALESCE(COUNT(DISTINCT ph.purchase_id), 0) AS total_purchases,
    COALESCE(COUNT(DISTINCT ph.purchase_id) * 20, 0) AS purchases_mark,
    COALESCE(COUNT(DISTINCT c.comment_id), 0) AS total_comments,
    COALESCE(COUNT(DISTINCT c.comment_id) * 3, 0) AS comments_mark,
    COALESCE(COUNT(DISTINCT f.feedback_id), 0) AS total_feedback,
    COALESCE(COUNT(DISTINCT f.feedback_id) * 4, 0) AS feedback_mark,
    COALESCE(COUNT(DISTINCT af.followed_artist_user_id), 0) AS total_followings,
    COALESCE(COUNT(DISTINCT af.followed_artist_user_id) * 2, 0) AS followings_mark,
    (COALESCE(COUNT(DISTINCT al.artwork_id) * 1, 0) + 
     COALESCE(COUNT(DISTINCT ph.purchase_id) * 20, 0) + 
     COALESCE(COUNT(DISTINCT c.comment_id) * 3, 0) +
     COALESCE(COUNT(DISTINCT f.feedback_id) * 4, 0) +
     COALESCE(COUNT(DISTINCT af.followed_artist_user_id) * 2, 0)) AS total_mark
FROM 
    user u
LEFT JOIN 
    artwork_like al ON u.user_id = al.user_id AND al.liked_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
LEFT JOIN 
    purchase_history ph ON u.user_id = ph.user_id AND ph.purchase_datetime >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
LEFT JOIN 
    comment c ON u.user_id = c.user_id AND c.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
LEFT JOIN 
    feedback f ON u.user_id = f.customer_user_id AND f.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
LEFT JOIN 
    artist_follower af ON u.user_id = af.follower_user_id AND af.follow_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
WHERE 
    u.role = 'customer' AND
    u.isActive = 1 AND 
    u.isBanned = 0
GROUP BY 
    u.user_id, u.username, u.email, u.fName, u.LName, u.profile_photo_url, u.location
ORDER BY 
    total_mark DESC
LIMIT 10;`
    )
  }
}

module.exports = Dashboard;
