const serviceModel = require("../models/service.model");
const { translateError } = require("../utils/mongo_helper");

exports.popularServices = async () => {
  try {
    const services = await serviceModel.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchantId",
          foreignField: "_id",
          as: "merchant",
        },
      },
      { $sample: { size: 10 } },
      {
        $project: {
          price: 1,
          name: 1,
          photo: 1,
          "merchant.businessName": 1,
          "merchant._id": 1,
          "merchant.storeAddress": 1,
        },
      },
    ]);
    console.log(services);

    return [true, services];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to get all services."];
  }
};

exports.searchForService = async (name) => {
  try {
    const foundServices = await serviceModel.aggregate([
      { $match: { name: {$regex: new RegExp(name, "i")} } },
      { $sample: { size: 10 } },
      {
        $lookup: {
          from: "merchants",
          localField: "merchantId",
          foreignField: "_id",
          as: "merchant",
        },
      },
      {
        $project: {
          price: 1,
          name: 1,
          photo: 1,
          "merchant.businessName": 1,
          "merchant._id": 1,
          "merchant.storeAddress": 1,
        },
      },
    ]);
    console.log(foundServices)

    if(!foundServices) return [false, "No search result for service"];

    return [true, foundServices];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to get popular services."];
  }
};
