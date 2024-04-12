const db = require('../utils/database');

class ArtCategories {
  constructor(category_id, name, description, margin) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.margin = margin;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM category');
  }

  static post(name, description, margin, banner) {
    return db.execute(
      'INSERT INTO category (name, description, margin, banner) VALUES (?, ?, ?, ?)',
      [name, description, margin, banner]
    )
      .then(([result]) => {
        return { categoryId: result.insertId }; // Return the generated category ID
      });
  }

  static update(category_id, name, description, margin, banner) {
    return db.execute(
      'UPDATE category SET name = ?, description = ?, margin = ?, banner = ? WHERE category_id = ?',
      [name, description, margin,banner, category_id]
    )
      .then(() => {
        return { categoryId: category_id }; // Return the updated category ID
      });
  }

  static delete(category_id) {
    return db.execute('DELETE FROM category WHERE category_id = ?', [category_id]);
  }
}

class ArtCategoriesFormats {
  constructor(format_id, category_id, format_name) {
    this.format_id = format_id;
    this.category_id = category_id;
    this.format_name = format_name;
  }

  static fetchSupportedFormats(category_id) {
    return db.execute('SELECT * FROM supported_formats WHERE category_id = ?', [category_id]);
  }

  static fetchArtworkCount(category_id) {
    return db.execute('SELECT COUNT(title) AS artwork_count FROM artwork WHERE category_id = ?', [category_id]);
  }

  static post(category_id, format_name) {
    return db.execute(
      'INSERT INTO supported_formats (category_id, format_name) VALUES (?, ?)',
      [category_id, format_name]
    );
  }

  static update(format_id, category_id, format_name) {
    return db.execute(
      'UPDATE supported_formats SET category_id = ?, format_name = ? WHERE format_id = ?',
      [category_id, format_name, format_id]
    );
  }

  static deleteByCategoryId(category_id) {
    return db.execute('DELETE FROM supported_formats WHERE category_id = ?', [category_id]);
  }

  static delete(format_id) {
    return db.execute('DELETE FROM supported_formats WHERE format_id = ?', [format_id]);
  }
}

module.exports = { ArtCategories, ArtCategoriesFormats };