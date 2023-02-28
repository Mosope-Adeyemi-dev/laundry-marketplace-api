// Response handler to handle all api responses
exports.responseHandler = (
  res,
  message,
  statusCode,
  success = false,
  data = null
) => {
  const response = {
    success,
    message,
  }
  data != null ? response.data = data : ''
  res.status(statusCode).json(response);
};
