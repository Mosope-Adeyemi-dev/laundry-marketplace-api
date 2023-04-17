const { responseHandler } = require("../utils/responseHandler");
const { checkJwt } = require("../utils/token");
const merchantModel = require("../models/merchant.model");

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

    const merchant = await merchantModel.findById(id)

    // console.log(merchant)

    if(!merchant) return responseHandler(res, "Unauthorized - User doesn't exist", 403, false)

    if(!merchant.status) return responseHandler(res, "Unauthorized - Account disabled, contact admin.", 403, false)

    if(merchant.completedRegistration && !merchant.isApproved) return responseHandler(res, "You're account is pending verification. Please contact support", 403, false)

    req.user = merchant.id
    req.isActive = merchant.status
    req.isApproved = merchant.isApproved
    
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
