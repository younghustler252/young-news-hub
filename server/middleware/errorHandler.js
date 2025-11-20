const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}

	const statusCode = err.statusCode || res.statusCode || 500;

	// 👇 Log the error to terminal
	console.error(err.message);

	res.status(statusCode).json({
		success: false,
		message: err.message || 'Internal Server Error',
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

module.exports = errorHandler;
