const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const Blog = require('../../models/Blog');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');

dotenv.config({ path: './config.env' });

require('../../startup/db')();

// Read JSON file
const blogs = JSON.parse(fs.readFileSync(path.join(`${__dirname}/blogs.json`), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(`${__dirname}/users.json`), 'utf-8'));
const comments = JSON.parse(fs.readFileSync(path.join(`${__dirname}/comments.json`), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(`${__dirname}/categories.json`), 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Blog.create(blogs);
        await User.create(users, { validateBeforeSave: false });
        await Comment.create(comments);
        await Category.create(categories);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// Delete all data from DB
const deleteData = async () => {
    try {
        await Blog.deleteMany();
        await User.deleteMany();
        await Comment.deleteMany();
        await Category.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// console.log(process.argv);
