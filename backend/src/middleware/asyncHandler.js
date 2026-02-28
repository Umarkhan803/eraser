const asyncHandler = (fn) => (req, res, next) => {
  // record the handler name so any later middleware knows which function was
  // executing; this is particularly helpful when the patched res.json
  // middleware is unable to infer a name from the stack trace.
  if (fn && fn.name) {
    req.handlerName = fn.name;
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
