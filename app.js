const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

// Routes
const categoryRouter = require('./routes/category');
const commentRouter = require('./routes/comment');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const viewRouter = require('./routes/view');

const Blog = require('./models/Blog');
const Category = require('./models/Category');
const catchAsync = require('./utils/catchAsync');

// Start express app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(`${__dirname}/views`));

// Global Middlewares
// Implement CORS
app.use(cors());

// Access-Control-Allow-Origin
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(`${__dirname}/public`)));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,   // 1hr
    message: 'Too many requests from this IP, Please try again in an hour!'
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'title',
        'content',
        'createdAt'
    ]
}));

// Method override middleware
app.use(methodOverride('_method'));

// Compression middleware
app.use(compression());

app.use(catchAsync(async (req, res, next) => {
    const blogs = await Blog.aggregate([
        {
            $sample: { size: 5 }
        }
    ]);

    res.locals.recentPosts = blogs;
    next();
}));

app.use(catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.locals.categories = categories;
    next();
}));

app.use((req, res, next) => {
    res.locals.page = req.originalUrl;
    next();
});

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
});

app.use('/', viewRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/categories', categoryRouter);

app.use('/blogs', (req, res, next) => {
    res.status(200).redirect('/');
    next();
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;