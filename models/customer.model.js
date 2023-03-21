const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = Schema(
  {
    fullname: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      required: [true, "Email already exists"],
    },
    cart: [{
      quantity: { type: Number, required: true },
      serviceId: { type: Schema.Types.ObjectId, ref: "Service", unique: true },
      merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
    }],
    phoneNumber: { type: String, required: true },
    password: { type: String },
  },
  { timestamps: true }
);

customerSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

customerSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Customer", customerSchema);
