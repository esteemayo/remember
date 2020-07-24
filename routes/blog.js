const express = require('express');
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentRouter = require('../routes/comment');
// const commentController = require('../controller/commentController');

const router = express.Router();

router.use('/:blogId/comments', commentRouter);

/*** 
 router
     .route('/:blogId/comments')
     .post(
         authController.protect,
         authController.restrictTo('user'),
         commentController.createComment
     );
 */

router.post('/contact', blogController.contactUs);

router.use(authController.protect);

router
    .route('/')
    .get(
        authController.restrictTo('admin', 'user'),
        blogController.getAllBlogs
    )
    .post(
        authController.restrictTo('admin', 'user'),
        blogController.uploadBlogImage,
        blogController.resizeBlogImage,
        blogController.sendUserId,
        blogController.createBlog
    );

router
    .route('/:id')
    .get(
        authController.restrictTo('admin', 'user'),
        blogController.getBlog
    )
    .patch(
        authController.restrictTo('admin', 'user'),
        blogController.uploadBlogImage,
        blogController.resizeBlogImage,
        blogController.sendUserId,
        blogController.updateBlog
    )
    .delete(
        authController.restrictTo('admin', 'user'),
        blogController.deleteBlog
    );

module.exports = router;

