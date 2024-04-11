const {ArtCategories,ArtCategoriesFormats} = require('../services/art-categories.service');

exports.fetchAll = async (req, res, next) => {
  try {
      // Fetch all categories
      const categories = await ArtCategories.fetchAll();

      // Map over the categories and fetch associated formats and artwork count for each category
      const categoriesWithFormatsAndCount = await Promise.all(
          categories[0].map(async (category) => {
              const formats = await ArtCategoriesFormats.fetchSupportedFormats(category.category_id);
              const count = await ArtCategoriesFormats.fetchArtworkCount(category.category_id);
              return {
                  ...category,
                  totalArtworks: count[0][0].artwork_count, // Access the artwork count correctly
                  formats: formats[0] // Access the format array
              };
          })
      );

      res.status(200).json(categoriesWithFormatsAndCount);
  } catch (error) {
      next(error);
  }
};


exports.createCategory = async (req, res, next) => {
  const { name, description, margin, formats } = req.body;

  try {
    // Create category
    const categoryResult = await ArtCategories.post(name, description, margin);

    // Get the generated category ID
    const categoryId = categoryResult.categoryId;

    console.log('Received formats:', formats);

    // Create formats associated with the category
    const formatPromises = formats.map(format => {
      console.log('categoryId:', categoryId);
      console.log('format_name:', format.format_name);
      return ArtCategoriesFormats.post(categoryId, format.format_name);
    });

    // Wait for all format insertions to complete
    await Promise.all(formatPromises);

    res.status(201).json({ message: 'Category created successfully!', categoryId });
  } catch (error) {
    console.error('Error creating category:', error);
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const { name, description, margin, formats } = req.body;

  try {
    // Update category
    await ArtCategories.update(categoryId, name, description, margin);

    // Update or insert new formats associated with the category
    const existingFormats = await ArtCategoriesFormats.fetchSupportedFormats(categoryId);

    // Identify which formats need to be updated and which ones need to be inserted
    const updatePromises = formats.map(async format => {
      if (format.format_id && existingFormats[0].some(existingFormat => existingFormat.format_id === format.format_id)) {
        // Update existing format
        await ArtCategoriesFormats.update(format.format_id, categoryId, format.format_name);
      } else {
        // Insert new format
        await ArtCategoriesFormats.post(categoryId, format.format_name);
      }
    });

    // Wait for all update and insert operations to complete
    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Category updated successfully!', categoryId });
  } catch (error) {
    console.error('Error updating category:', error);
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    // Delete category
    await ArtCategories.delete(categoryId);

    // Delete associated supported formats
    await ArtCategoriesFormats.deleteByCategoryId(categoryId);

    res.status(200).json({ message: 'Category and associated formats deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
