const { getAllMerchants, changeMerchantStatus, getMerchantInfoById, approveMerchant } = require("../services/admin.services")
const { responseHandler } = require('../utils/responseHandler')

const listMerchants = async (req, res) => {
    try {
        const check = await getAllMerchants()
        if(!check[0]) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Merchants retrieved successfully.', 200, true,{merchants: check[1]})
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}


const updateMerchantStatus =  async (req, res) => {
    try {
        const { isActive, merchantId } = req.body

        const check = await changeMerchantStatus(merchantId, isActive)

        if(!check[0]) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Merchant updated successfully.', 200, true, null)
    } catch (error) {
        console.log(error)
        return responseHandler(res, error, 400, false, null)
    }
}

const getMerchantInfo = async (req, res) => {
    try {
        const { merchantId } = req.params
        if(merchantId == '') return responseHandler(res, "Error - Include valid merchant id")
        const check = await getMerchantInfoById(merchantId)
        if(!check[0]) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Merchant retrieved successfully.', 200, true,{ merchant: check[1] })
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

const approveMerchantAccount = async (req, res) => {
    try {
        const { merchantId } = req.body
        const check = await approveMerchant(req.user, merchantId)

        if(!check[0]) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, check[1], 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

module.exports = {
    listMerchants,
    updateMerchantStatus,
    getMerchantInfo,
    approveMerchantAccount,
}