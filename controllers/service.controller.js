const { popularServices, searchForService } = require("../services/service.service");
const { responseHandler } = require("../utils/responseHandler");

exports.retrievePopularServices = async (req, res) => {
    try {
        const check = await popularServices()

        if(check[0] == false) return responseHandler(res, check[1], 400, false)

        return responseHandler(res, 'Service retrieved successfully', 200, true, check[1])
    } catch (error) {
        return responseHandler(res, "Oops. An error occurred on our end", 500, false)
    }
}

exports.findServices = async (req, res) => {
    try {
        if(req.query.serviceName == undefined) responseHandler(res, "invalid request. include required parameters", 400)
        console.log(req.query.serviceName)

        const check = await searchForService(req.query.serviceName)

        if(check[0] == false) return responseHandler(res, check[1], 400, false)

        return responseHandler(res, 'Search result retrieved successfully', 200, true, check[1])
    } catch (error) {
        console.log(error)
        return responseHandler(res, "Oops. An error occurred on our end", 500, false)
    }
}