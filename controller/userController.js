const _ = require('lodash');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controller/handlerFactory');

/**********************
 const multerStorage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, 'public/img/users');
     },
     filename: (req, file, cb) => {
         const ext = file.mimetype.split('/')[1];
         cb(null, `users-${req.user.id}-${Date.now()}.${ext}`);
     }
 });
 */

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

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(`This route is not for password updates. Please use ${req.protocol}://${req.get('host')}/api/v1/users/updateMyPassword`, 400));
    }

    // Filtered out unwanted fields names that are not allowed to be updated
    const filterBody = _.pick(req.body, ['name', 'email', 'username', 'about']);
    if (req.file) filterBody.avatar = req.file.filename;

    // Update user document
    const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: `This route is not defined! Please use ${req.protocol}://${req.get('host')}/api/v1/users/signup instead`
    });
};

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do NOT update or delete password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);