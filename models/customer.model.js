const { Schema, default: mongoose } =require('mongoose');
const bcrypt = require('bcrypt')

const cartObject = Schema({
    quantity: { type: String, required: true },
    storeId: { type: Date },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services' }
})

const customerSchema = Schema({
    firstame: { type: String, trim: true },
    lastname: { type: String, trim: true },
    email:{ type: String, unique: true, required: [true, 'Email already exists'] },
    phoneNumber: { type: String, required: true },
    password: { type: String },
    cart: [cartObject]
}, {timestamp: true})

customerSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('Customer', customerSchema);