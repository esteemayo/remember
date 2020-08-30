const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A blog post must have a title'],
        unique: true,
        trim: true,
        maxlength: [100, 'A blog name must have less or equal than 100 characters'],
        minlength: [10, 'A blog name must have more or equal than 10 charaters']
    },
    content: {
        type: String,
        required: [true, 'A blog post must have a content'],
        trim: true
    },
    subContent: {
        type: String,
        required: [true, 'A blog post must have a subContent field'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A blog post description must be specified'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    image: String,
    imageId: String,
    category: {
        type: String,
        required: [true, 'A blog must belong to a category']
    },
    categorySlug: {
        type: String,
        lowercase: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A blog must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Performance index
blogSchema.index({ category: 1, categorySlug: -1 });

// Virtual Populate comments
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

blogSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

blogSchema.pre('save', function (next) {
    this.categorySlug = slugify(this.category, { lower: true });
    next();
});

blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email username about avatar'
    });

    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;