/* eslint-disable */
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 🎇 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

require('./startup/db')();

const PORT = process.env.PORT || 4900;

const server = app.listen(PORT, console.log(`APP LISTENING ON PORT ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 🎇 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});