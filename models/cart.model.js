const { Schema, default: mongoose } = require('mongoose');

const cartSchema = Schema({
    quantity: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services' }
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema);