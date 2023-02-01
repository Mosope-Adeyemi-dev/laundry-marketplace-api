// Response handler to handle all api responses
exports.responseHandler = (
  res,
  message,
  statusCode,
  success = false,
  data = null
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
