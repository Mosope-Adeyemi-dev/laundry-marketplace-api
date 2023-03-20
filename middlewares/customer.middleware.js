const { responseHandler } = require("../utils/responseHandler");
const { checkJwt } = require("../utils/token");
const customerModel = require("../models/customer.model");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(" ")[1];
    const check = await checkJwt(token);

    const { id, exp, err } = check;
    if (err) {
      console.error(err)
      return responseHandler(res, "Unauthorized", 403, false, "");
    }

    const customer = await customerModel.findById(id)

    // console.log(customer)

    if(!customer) return responseHandler(res, "Unauthorized - User doesn't exist", 403, false)

    req.user = customer.id
    req.email = customer.email
    
    return next()
  }
  return responseHandler(
    res,
    "Unauthorized - No auth token found",
    403,
    false,
    ""
  );
};

module.exports = verifyToken
