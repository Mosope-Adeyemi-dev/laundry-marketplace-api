const { Schema, default: mongoose } =require('mongoose');
const bcrypt = require('bcrypt')

const merchantSchema = Schema({
    fullName: { type: String, trim: true },
    email:{ type: String, unique: true, required: [true, 'Email already exists'] },
    businessName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true },
    merchantId: { type: String, required: true },
    storeAddress: { type: String, required: true },
    ownerID: { type: String },
    ownerIDType: { type: String, enum: ["nin", "driver-license", "passport"] },
    cacDocument: { type: String },
    password: { type: String },
    availabilityStatus: { type: Boolean },
    bankDetails: [{
        bank: String,
        accountNumber: String,
        accountName: String
    }],
    approvalDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    completedRegistration: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
}, {timestamps: true})

merchantSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('Merchant', merchantSchema);