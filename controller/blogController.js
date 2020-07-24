const multer = require('multer');
const sharp = require('sharp');
const Blog = require('../models/Blog');
const factory = require('../controller/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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

exports.uploadBlogImage = upload.single('image');

exports.resizeBlogImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const id = !req.params.id ? 'new' : req.params.id;

    req.file.filename = `blogs-${id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/blogs/${req.file.filename}`);

    next();
});

exports.contactUs = catchAsync(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    try {
        await new ReceiveEmail(name, email, subject, message).contactUs();

        res.status(200).json({
            status: 'success',
            message: 'Thanks for contacting us!'
        });
    } catch (err) {
        return next(new AppError('There was an error sending the email! Please try again later.', 500));
    }
});

exports.sendUserId = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllBlogs = factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog, 'comments');
exports.createBlog = factory.createOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);