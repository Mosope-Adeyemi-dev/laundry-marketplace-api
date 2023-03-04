const { Schema, default: mongoose } = require('mongoose');

const serviceSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    photo: String,
    merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant' }
}, {timestamp: true})

module.exports = mongoose.model('Service', serviceSchema);