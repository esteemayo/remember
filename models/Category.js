const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name field'],
        unique: [true, 'Category already exists. Choose another one'],
        maxlength: [15, 'A category name must have less or equal than 15 characters'],
        minlength: [3, 'A category name must have more or equal than 3 characters'],
        trim: true
    },
    slug: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
