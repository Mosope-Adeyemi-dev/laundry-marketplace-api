const { Schema, default: mongoose } = require('mongoose');

const orderSchema = Schema({
    // services: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
    totalPrice: { type: Number, required: true },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveryType: {
        type: String,
        enum: ["pick-up", "drop-off"],
        required: true
    },
    pickUpAddress: String,
    dropOffAddress: String,
    paymentMethod: {
        type: String,
        enum: ["online", "cash"],
        required: true
    },
    // status: {
    //     type:String,
    //     enum: ["delivered", "picked-up"]
    // },
    orderCompleted: {type: Boolean, default: false},
    merchant: { type: Schema.Types.ObjectId, ref: 'Merchant' },
    cart: {type: Object, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    paymentReference: String
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);
