/* eslint-disable */
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ReceiveEmail = require('../utils/receiveEmail');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserAvatar = upload.single('avatar');

exports.uploadBlogImage = upload.single('image');

exports.resizeUserAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `users-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

exports.resizeBlogImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `blogs-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/blogs/${req.file.filename}`);

    next();
});

exports.getBlogOverview = catchAsync(async (req, res, next) => {
    if (req.query.search) {
        // Get blog data from collection
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const blogs = await Blog.find({ 'title': regex });

        if (blogs.length < 1) {
            return next(new AppError('No blog post match that query! Please try again.', 404));
        }

        // Build and render template using the blog data
        res.status(200).render('overview', {
            title: 'Blog Overview',
            blogs
        });
    } else {
        // Get blog data from collection
        const blogs = await Blog.find().sort({ createdAt: -1 });

        // Build and render template using the blog data
        res.status(200).render('overview', {
            title: 'Blog Overview',
            blogs
        });
    }
});

exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate({
        path: 'comments',
        fields: 'comment user'
    });

    if (!blog) {
        return next(new AppError('No blog found with the given SLUG', 404));
    }

    res.status(200).render('blog', {
        title: blog.title,
        blog
    });
});

exports.postComment = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('No blog found with the given ID', 404));
    }

    await Comment.create({
        comment: req.body.comment,
        user: req.user.id,
        blog: blog._id
    });

    res.status(201).redirect(`/blog/${blog.slug}`);
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    // let filterBody = _.pick(req.body, ['name', 'email', 'username', 'about']);
    const filterBody = req.body;
    if (req.file) filterBody.avatar = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });

    if (!updatedUser) {
        return next(new AppError('No user found with the given ID', 404));
    }

    res.status(200).render('account', {
        title: 'Your Account',
        user: updatedUser
    });
});

exports.getResetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    res.status(200).render('reset', {
        title: 'Reset your account password!',
        token: hashedToken
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError('Token is invalid or has expired!', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).redirect('/login');
});

exports.adminDashboard = catchAsync(async (req, res, next) => {
    if (!res.locals.user && res.locals.user.role !== 'admin') return res.status(401).redirect('/');

    const blogs = await Blog.find().sort({ createdAt: 'desc' });

    res.status(200).render('admin', {
        title: 'Admin Dashboard!',
        blogs
    });
});

exports.editBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    const categories = await Category.find();

    if (!blog) {
        return next(new AppError('No blog found with the given ID', 404));
    }

    res.status(200).render('edit', {
        title: 'Admin | Edit post',
        blog,
        categories
    });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
    let blog = req.body;
    if (req.file) blog.image = req.file.filename;

    blog = await Blog.findByIdAndUpdate(req.params.id, blog, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return next(new AppError('No blog found with the given ID', 404));
    }

    res.status(200).redirect(`/admin/dashboard`);
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        return next(new AppError('No blog found with the given ID', 404));
    }

    res.status(204).redirect('back');
});

exports.getBlogCategory = catchAsync(async (req, res, next) => {
    const blogs = await Blog.find({ categorySlug: req.params.categorySlug })

    res.status(200).render('overview', {
        title: blogs.category,
        blogs
    });
});

exports.userProfile = catchAsync(async (req, res, next) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        return next(new AppError('No blog found with the given SLUG', 404));
    }

    res.status(200).render('profile', {
        title: `Author's profile`,
        blog
    });
});

exports.commentUserProfile = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId).populate('user');

    if (!comment) {
        return next(new AppError('No comment found with the given ID', 404));
    }

    res.status(200).render('user', {
        title: `User's profile`,
        comment
    });
});

exports.newBlogPage = catchAsync(async (req, res, next) => {
    if (!res.locals.user) return res.status(401).redirect('/login');

    const categories = await Category.find();

    res.status(200).render('add', {
        title: 'Create New Blog Post',
        categories
    });
});

exports.contactMessage = catchAsync(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return next(new AppError('Please all fields are required', 400));
    }

    try {
        await new ReceiveEmail(name, email, subject, message).contactUs();

        res.status(200).redirect('/contact');
    } catch (err) {
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.getSignupForm = (req, res) => {
    if (res.locals.user) return res.status(200).redirect('/');

    res.status(200).render('signup', {
        title: 'Create your account!'
    });
};

exports.getLoginForm = (req, res) => {
    if (res.locals.user) return res.status(200).redirect('/');

    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getContact = (req, res) => {
    res.status(200).render('contact', {
        title: 'Contact Us!'
    });
};

exports.about = (req, res) => {
    res.status(200).render('about', {
        title: 'About Us!'
    });
};

exports.account = (req, res) => {
    if (!res.locals.user) return res.status(400).redirect('/login');

    res.status(200).render('account', {
        title: 'Your Account'
    });
};

exports.getForgotPassword = (req, res) => {
    if (res.locals.user) return res.status(400).redirect('/');

    res.status(200).render('forgot', {
        title: 'Forgot Password'
    });
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

