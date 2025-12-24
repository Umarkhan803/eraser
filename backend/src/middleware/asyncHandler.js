const asyncHandler = (fn) => (req, res, next) => {
  try {
    const result = fn(req, res, next);
    if (result && typeof result.then === "function") {
      result.catch(next);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = asyncHandler;
