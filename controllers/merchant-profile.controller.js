const { uploadMerchantDoc, updateAvailability } = require("../services/merchant.service")
const { responseHandler } = require('../utils/responseHandler')
const formidable = require("formidable")
const cloudinaryUpload = require("../utils/cloudinary")

const uploadDocuments = async (req, res) => {
    try {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseHandler(res, "Error - Upload all required documents", 400, false, null)
            }
            const { ownerID, cacCertificate } = files
            const {idType} = fields
            if(!idType) return responseHandler(res, "Error - Include valid ID type", 400, false, null)
            if(!ownerID || !cacCertificate) return responseHandler(res, "Error - Upload all required documents", 400, false, null)

            let idUrl, cacCertificateUrl;

            await cloudinaryUpload(ownerID.filepath).then((downloadURL) => {
                idUrl = downloadURL;
              })
              .catch((error) => {
                console.error(error);
            });

            await cloudinaryUpload(ownerID.filepath).then((downloadURL) => {
                cacCertificateUrl = downloadURL;
              })
              .catch((error) => {
                console.error(error);
            });

            if(!idUrl || !cacCertificateUrl) return responseHandler(res, "Upload failed, try again.", 400, false, null)

            const check = await uploadMerchantDoc(req.user, idType, idUrl, cacCertificateUrl)

            if(!check[0]) return responseHandler(res, check[1], 400, false, null)

            return responseHandler(res, 'Upload successful. Your account is pending approval', 201, true, null)
        });
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

const updateAvailabilityStatus = async(req, res) => {
    try {
        const { isAvailable } = req.body
        if(typeof isAvailable !== "boolean") return responseHandler(res, "Error - Include valid status type", 400, false, null)

        const check = await updateAvailability(req.user, isAvailable)
        if (check[0] == false) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Merchant availability updated.', 200, true, null)
    } catch (error) {
        console.error(error)
        return responseHandler(res, error, 400, false, null)
    }
}

module.exports = {
    uploadDocuments,
    updateAvailabilityStatus
}