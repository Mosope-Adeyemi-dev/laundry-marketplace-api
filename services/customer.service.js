const customerModel = require("../models/customer.model");
const serviceModel = require("../models/service.model");
const bcrypt = require("bcrypt");
const { translateError } = require("../utils/mongo_helper");
const { createToken } = require("../utils/token");
const { default: mongoose, Mongoose } = require("mongoose");
const merchantModel = require("../models/merchant.model");
const orderModel = require("../models/order.model");

exports.registerCustomer = async (body) => {
  try {
    const { fullname, password, email, phoneNumber } = body;

    const newUser = await customerModel.create({
      fullname,
      email,
      password,
      phoneNumber,
    });

    if (!newUser) return [false, "Failed to register user"];

    return [true, newUser];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to register user"];
  }
};

exports.authenticateCustomer = async (email, password) => {
  try {
    const user = await customerModel
      .findOne({ email })
      .select("email fullname password");

    if (!user) return [false, "Incorrect username or password"];

    if (!(await bcrypt.compare(password, user.password)))
      return [false, "Incorrect username or password."];

    const token = await createToken(user.id);

    const { fullname } = user;

    return [
      true,
      {
        token,
        user: {
          fullname,
          email: user.email,
        },
      },
    ];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to login."];
  }
};

exports.addToCart = async (userId, body) => {
  try {
    const { serviceId, quantity } = body;

    // get data of service to add to cart
    const service = await serviceModel.findById(serviceId);
    const { name, price, merchantId } = service;

    //get current cart data
    const userCart = (await customerModel.findById(userId).select("cart")).cart;

    const isServiceInCart = userCart.some(
      (item) => item.serviceId == serviceId
    );
    if (isServiceInCart) {
      return [false, "Service is already in your cart."];
    }

    const updatedCart = await customerModel
      .findByIdAndUpdate(
        userId,
        { $push: { cart: { serviceId, quantity, merchantId } } },
        { new: true }
      )
      .select("cart");

    if (!updatedCart) return [false, "Failed to add service to cart."];

    return [true, updatedCart];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to add service to cart."];
  }
};

exports.getCart = async (userId) => {
  try {
    // const user = await userModel.findById(userId);
    const result = await customerModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$cart",
      },
      {
        $lookup: {
          from: "merchants",
          localField: "cart.merchantId",
          foreignField: "_id",
          as: "merchant",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "cart.serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$service",
      },
      {
        $unwind: "$merchant",
      },
      {
        $project: {
          quantity: "$cart.quantity",
          merchantStore: "$merchant.businessName",
          merchantAddress: "$merchant.storeAddress",
          merchantId: "$merchant._id",
          serviceName: "$service.name",
          unitPrice: "$service.price",
          servicePhoto: "$service.photo",
          totalPrice: { $multiply: ["$service.price", "$cart.quantity"] },
        },
      },
    ]);

    if (!result) return [false, "Unable to retrieve your cart"];

    console.log(result);
    return [true, result];
    // get cart element which is object with serviceId, quantity and merchantId in cart array,
    // lookup to get service price
    // lookup to get merchant info
    // calculate total balance,
    // calculate balance grouped by merchant
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve your orders"];
  }
};

exports.getCartAmount = async (id) => {
  try {
    const result = await customerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      { $unwind: "$cart" },
      {
        $lookup: {
          from: "services",
          localField: "cart.serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$service",
      },
      // Calculate the total price for each item by multiplying quantity and price
      {
        $project: {
          totalItemPrice: { $multiply: ["$cart.quantity", "$service.price"] },
        },
      },

      // Group the documents to calculate the total price for the entire array
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalItemPrice" },
        },
      },
    ]);

    if (!result) return [false, "Unable to retrieve your cart"];

    // cart is empty
    if (result.length == 0) return [true, 0];

    console.log(result);
    return [true, result[0].totalPrice];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve your orders"];
  }
};

exports.placeOrder = async (id, body) => {
  try {
    const { deliveryType, pickUpAddress, dropOffAddress, paymentMethod } = body;

    // get items in cart to place order
    const cartCheck = await this.getCart(id);

    if (!cartCheck[0]) return [false, check[1]];

    const cart = cartCheck[1];
    console.log(cart, "cart")

    if (cart.length == 0) return [false, "Add services to your cart to place an order"];

    // Get total amount for order
    let cartTotal = 0;

    for (let index = 0; index < cart.length; index++) {
        console.log(cart[index].totalPrice)
        cartTotal += cart[index].totalPrice;
    } 
        
    console.log(cartTotal, "cart total")

    const order = await orderModel.create({
      // services,
      deliveryType,
      pickUpAddress,
      dropOffAddress,
      paymentMethod,
      totalPrice: cartTotal,
      customerId: id,
      cart,
    });

    if (!order) return [false, "Unable place order. Please try again"];

    // empty cart
    const updatedUser = await customerModel.findByIdAndUpdate(id, { $set: { cart: [] } }, { new: true}).select('cart');
    console.log(updatedUser, 'updated user')

    console.log(order);
    return [true, order];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve your orders"];
  }
};


exports.getOrdersById = async (id) =>  {
    try {
        const orders = await orderModel.find({customerId: id})

        if(!orders) return [false, "Unable to retrieve your orders"]

        return [true, orders]
    } catch (error) {
        console.log(error);
    return [false, translateError(error) || "Unable to retrieve your orders"];
    }
}