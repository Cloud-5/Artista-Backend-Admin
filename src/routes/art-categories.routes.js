const express = require('express');
const router = express.Router();
const artCategoriesController = require('../controllers/art-categories.controller');

router.get('/', artCategoriesController.fetchAll);
router.post('/', artCategoriesController.createCategory);
router.put('/:categoryId', artCategoriesController.updateCategory);
router.delete('/:categoryId', artCategoriesController.deleteCategory);

module.exports = router;