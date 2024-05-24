const { StatusCodes } = require('http-status-codes');

const defaultController = (_, res) => { // The first argument is the request object, but we don't need it here
	try {
		res.status(StatusCodes.OK).json({ message: 'Hello World!' });
	} catch (err) {
		console.error(err); // Log the error or handle it appropriately
	}
};

module.exports = defaultController;

