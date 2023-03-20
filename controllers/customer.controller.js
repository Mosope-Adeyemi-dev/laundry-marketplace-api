const {
  registerCustomer,
  authenticateCustomer,
  addToCart,
  getCart,
  placeOrder,
  getOrdersById,
} = require("../services/customer.service");
const { responseHandler } = require("../utils/responseHandler");
const formidable = require("formidable");

const signup = async (req, res) => {
  try {
    const check = await registerCustomer(req.body);

    if (check[0] == false)
      return responseHandler(res, check[1], 400, false, "");

    return responseHandler(res, "User registered successfully.", 201, true);
  } catch (error) {
    return responseHandler(res, error, 400, false, null);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await authenticateCustomer(email, password);

    if (check[0] == false)
      return responseHandler(res, check[1], 400, false, null);

    return responseHandler(res, "Login successful", 200, true, check[1]);
  } catch (error) {
    return responseHandler(res, "An error occurred", 500, false);
  }
};

const addServiceToCart = async (req, res) => {
  try {
    const check = await addToCart(req.user, req.body);

    if (check[0] == false) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "Service added to cart", 200, true);
  } catch (error) {
    return responseHandler(res, "An error occurred", 500, false);
  }
};

const retrieveCart = async (req, res) => {
  try {
    const check = await getCart(req.user);

    if (check[0] == false) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "cart retrieved", 200, true, check[1]);
  } catch (error) {
    return responseHandler(res, "An error occurred", 500, false);
  }
};

const placeNewOrder = async (req, res) => {
  try {
    const check = await placeOrder(req.user, req.body);

    if (check[0] == false) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "Order placed successfully", 200, true, check[1]);
  } catch (error) {
    console.log(error)
    return responseHandler(res, "An error occurred", 500, false);
  }
};
// getOrdersById
const retrieveOrders = async (req, res) => {
    try {
        const check = await getOrdersById(req.user);
    
        if (check[0] == false) return responseHandler(res, check[1], 400, false);
    
        return responseHandler(res, "Orders retrieved successfully", 200, true, check[1]);
      } catch (error) {
        console.log(error)
        return responseHandler(res, "An error occurred", 500, false);
      }
}

module.exports = {
  signup,
  login,
  addServiceToCart,
  retrieveCart,
  placeNewOrder,
  retrieveOrders,
};
