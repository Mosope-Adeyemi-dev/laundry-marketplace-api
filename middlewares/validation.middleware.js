exports.validationMiddleware = (schema) => {
  return async (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      next();
    } catch (err) {
      // console.error(err)
      const errors = [];
      err.details.forEach((error) => {
        errors.push(error.message.replace(/"/g, ''));
      });
      res.status(400).send({
        success: false,
        errors,
      });
    }
  };
};
