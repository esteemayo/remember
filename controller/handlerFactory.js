const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.blogId) filter = { blog: req.params.blogId };

    // Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;

    // Send response
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

    // Execute query
    const doc = await query;

    // Check if the document is in the collection
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Send response
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

    // Execute query
    doc = await Model.create(doc);

    // Send response
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

    // Execute query
    doc = await Model.findByIdAndUpdate(req.params.id, doc, {
        new: true,
        runValidators: true
    });

    // Check if the document is in the collection
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    // Execute query
    const doc = await Model.findByIdAndDelete(req.params.id);

    // Check if the document is in the collection
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Send response
    res.status(204).json({
        status: 'success',
        data: null
    });
});