const express = require('express');
const authController = require('../controller/authController');
const viewController = require('../controller/viewController');

const router = express.Router();

router.get('/',
    authController.isLoggedIn,
    viewController.getBlogOverview
);

router.get('/blog/:slug',
    authController.isLoggedIn,
    viewController.getBlog
);

router.get('/login',
    authController.isLoggedIn,
    viewController.getLoginForm
);

router.get('/signup',
    authController.isLoggedIn,
    viewController.getSignupForm
);

router.post('/blog/:id/comments',
    authController.protect,
    authController.restrictTo('user'),
    viewController.postComment
);

router.get('/blogs/contact',
    authController.isLoggedIn,
    viewController.getContact
);

router.post('/blogs/contact',
    authController.isLoggedIn,
    viewController.contactMessage
);

router.get('/about',
    authController.isLoggedIn,
    viewController.about
);

router.get('/blogs/new',
    authController.isLoggedIn,
    viewController.newBlogPage
);

router.get('/me',
    authController.isLoggedIn,
    viewController.account
);

router.post('/submit-user-data',
    authController.protect,
    viewController.uploadUserAvatar,
    viewController.resizeUserAvatar,
    viewController.updateUserData
);

router.get('/forgot',
    authController.isLoggedIn,
    viewController.getForgotPassword
);

router.get('/reset/:token',
    viewController.getResetPassword
);

router.post('/reset/:token',
    viewController.resetPassword
);

router.get('/admin/dashboard',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.adminDashboard
);

router.get('/admin/blog/edit/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.editBlog
);

router.put('/admin/blog/edit/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.uploadBlogImage,
    viewController.resizeBlogImage,
    viewController.updateBlog
);

router.delete('/admin/blog/delete/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteBlog
);

router.get('/blogs/:categorySlug',
    authController.isLoggedIn,
    viewController.getBlogCategory
);

router.get('/blog/:slug/user',
    authController.isLoggedIn,
    viewController.userProfile
);

router.get('/blog/comment/:commentId/user',
    authController.isLoggedIn,
    viewController.commentUserProfile
)

module.exports = router;