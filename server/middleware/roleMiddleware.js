const ApiError = require('../utils/ApiError');

exports.checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'Access forbidden: insufficient permissions.');
  }
  next();
};
