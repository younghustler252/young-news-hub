const timestamp = new Date().toISOString();

const logger = async (req , res, next) => {
    console.log(`${req.method}  to ${req.originalUrl} at ${timestamp}`);
    next();
}

module.exports = logger;