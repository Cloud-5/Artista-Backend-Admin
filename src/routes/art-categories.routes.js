const express = require('express');
const router = express.Router();
const artCategoriesController = require('../controllers/art-categories.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', artCategoriesController.fetchAll);
router.post('/',verifyToken, artCategoriesController.createCategory);
router.put('/:categoryId',verifyToken, artCategoriesController.updateCategory);
router.delete('/:categoryId',verifyToken, artCategoriesController.deleteCategory);
router.delete('/formats/:categoryId',verifyToken, artCategoriesController.deleteFormats);

module.exports = router;