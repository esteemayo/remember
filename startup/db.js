/* eslint-disable */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Database local
const dbLocal = process.env.DATABASE_LOCAL;

// Database Atlas
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

module.exports = () => {
    // mongoose.connect(DB, {
    mongoose.connect(dbLocal, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(`Could not connect to MongoDB: ${err.message}`));
};
