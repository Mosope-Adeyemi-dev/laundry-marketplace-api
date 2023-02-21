const { responseHandler } = require("../utils/responseHandler");
const { checkJwt } = require("../utils/token");
const adminModel = require("../models/admin.model");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(" ")[1];
    const check = await checkJwt(token);

    const { id, exp, err } = check;
    if (err) {
      console.error(err)
      return responseHandler(res, "Unathorized", 403, false, "");
    }

    const admin = await adminModel.findById(id)

    if(!admin) return responseHandler(res, "Unauthorized - Admin doesn't exist", 403, false)

    if(admin.role !== "super-admin") return responseHandler(res, "Unathorized - priviledge not granted for your role.", 403, false)

    if(!admin.status) return responseHandler(res, "Unauthorised - Account disabled, contact admin.", 403, false)

    req.user = admin.id
    req.status = admin.status
    req.role = admin.role
    
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
