const admin = (req, res, next) => {
  // Authentication bypass: directly proceed to controller
  next();
};

module.exports = admin;