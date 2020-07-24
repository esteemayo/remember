const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.blogId) filter = { blog: req.params.blogId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: docs.length,
        data: {
            data: docs
        }
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    let doc = req.body;
    if (req.file) doc.image = req.file.filename;

    doc = await Model.create(doc);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    let doc = req.body;
    if (req.file) doc.image = req.file.filename;

    doc = await Model.findByIdAndUpdate(req.params.id, doc, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});