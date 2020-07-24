const express = require('express');
const authController = require('../controller/authController');
const categoryController = require('../controller/categoryController');

const router = express.Router();

// router.use(authController.protect);

router
    .route('/')
    .get(
        authController.protect,
        categoryController.getAllCategories
    )
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        categoryController.createCategory
    );

router
    .route('/:id')
    .get(
        authController.protect,
        categoryController.getCategory
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        categoryController.updateCategory
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        categoryController.deleteCategory
    );

module.exports = router;