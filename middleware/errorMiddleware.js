const errorHandler = (err, req, res, next) => {
    // If the status code is 200 (success), but we are in the error handler, 
    // change it to 500 (server error).
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Only show the stack trace in development mode (don't leak info to hackers)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };