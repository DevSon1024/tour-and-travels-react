/**
 * @desc    Middleware to check if the user is an admin
 */
const adminMiddleware = (req, res, next) => {
  // This middleware should always run AFTER authMiddleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { adminMiddleware };