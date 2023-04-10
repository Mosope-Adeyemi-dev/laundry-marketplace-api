const {
  uploadMerchantDoc,
  updateAvailability,
  listNewService,
  getMerchantServices,
  getPendingOrders,
  orderHistory,
  saveBankDetails,
  getById,
  updateOrderStatus,
} = require("../services/merchant.service");
const { responseHandler } = require("../utils/responseHandler");
const formidable = require("formidable");
const cloudinaryUpload = require("../utils/cloudinary");

const uploadDocuments = async (req, res) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseHandler(
          res,
          "Error - Upload all required documents",
          400,
          false,
          null
        );
      }
      const { ownerID, cacCertificate } = files;
      const { idType } = fields;
      if (!idType)
        return responseHandler(
          res,
          "Error - Include valid ID type",
          400,
          false,
          null
        );
      if (!ownerID || !cacCertificate)
        return responseHandler(
          res,
          "Error - Upload all required documents",
          400,
          false,
          null
        );

      let idUrl, cacCertificateUrl;

      await cloudinaryUpload(ownerID.filepath)
        .then((downloadURL) => {
          idUrl = downloadURL;
        })
        .catch((error) => {
          console.error(error);
        });

      await cloudinaryUpload(ownerID.filepath)
        .then((downloadURL) => {
          cacCertificateUrl = downloadURL;
        })
        .catch((error) => {
          console.error(error);
        });

      if (!idUrl || !cacCertificateUrl)
        return responseHandler(
          res,
          "Upload failed, try again.",
          400,
          false,
          null
        );

      const check = await uploadMerchantDoc(
        req.user,
        idType,
        idUrl,
        cacCertificateUrl
      );

      if (!check[0]) return responseHandler(res, check[1], 400, false, null);

      return responseHandler(
        res,
        "Upload successful. Your account is pending approval",
        201,
        true,
        null
      );
    });
  } catch (error) {
    return responseHandler(res, error, 500, false, null);
  }
};

const updateAvailabilityStatus = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    if (typeof isAvailable !== "boolean")
      return responseHandler(
        res,
        "Error - Include valid status type",
        400,
        false,
        null
      );

    const check = await updateAvailability(req.user, isAvailable);
    if (check[0] == false)
      return responseHandler(res, check[1], 400, false, null);

    return responseHandler(
      res,
      "Merchant availability updated.",
      200,
      true,
      null
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false, null);
  }
};

const registerNewService = async (req, res) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseHandler(
          res,
          "Error - Upload required photo",
          400,
          false,
          null
        );
      }
      const { photo } = files;
      const { name, price } = fields;
      if (!name || !price)
        return responseHandler(
          res,
          "Error - Include valid fields",
          400,
          false,
          null
        );
      if (!photo)
        return responseHandler(
          res,
          "Error - Upload required photo",
          400,
          false,
          null
        );

      let photoUrl;

      await cloudinaryUpload(photo.filepath)
        .then((downloadURL) => {
          photoUrl = downloadURL;
        })
        .catch((error) => {
          console.error(error);
        });

      if (!photoUrl)
        return responseHandler(
          res,
          "Upload failed, try again.",
          400,
          false,
          null
        );

      const check = await listNewService(name, req.user, price, photoUrl);

      if (!check[0]) return responseHandler(res, check[1], 400, false, null);

      return responseHandler(
        res,
        "Service added successfully",
        201,
        true,
        null
      );
    });
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false, null);
  }
};

const listServices = async (req, res) => {
  try {
    const check = await getMerchantServices(req.user);

    if (!check[0]) return responseHandler(res, check[1], 400, false, null);

    return responseHandler(
      res,
      "Services retrieved successfully",
      200,
      true,
      check[1]
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false, null);
  }
};

const pendingOrders = async (req, res) => {
  try {
    const check = await getPendingOrders(req.user);

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(
      res,
      "Pending orders retrieved successfully",
      200,
      true,
      check[1]
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false);
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const check = await orderHistory(req.user);
    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(
      res,
      "order history retrieved successfully",
      200,
      true,
      check[1]
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false);
  }
};

const saveMerchantAccount = async (req, res) => {
  try {
    const check = await saveBankDetails(
      req.user,
      req.body.bank,
      req.body.bank_code,
      req.body.account_number
    );
    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "bank details saved.", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false);
  }
};

const getUSerInfo = async (req, res) => {
  try {
    const check = await getById(req.user);

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "details retrieved", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, error, 500, false, null);
  }
};

const completeOrder = async (req, res) => {
    try {
        const check = await updateOrderStatus(req.body.orderId);
    
        if (!check[0]) return responseHandler(res, check[1], 400, false);
    
        return responseHandler(res, "order updated successfully", 200, true, check[1]);
      } catch (error) {
        console.error(error);
        return responseHandler(res, error, 500, false, null);
      }
} 
module.exports = {
  uploadDocuments,
  updateAvailabilityStatus,
  registerNewService,
  listServices,
  pendingOrders,
  getOrderHistory,
  saveMerchantAccount,
  getUSerInfo,
  completeOrder
};
