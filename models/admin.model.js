const { Schema, default: mongoose } =require('mongoose');
const bcrypt = require('bcrypt')

const inviteTokenSchema = Schema({
    token: { type: String, required: true },
    expires: { type: Date },
})

const adminSchema = Schema({
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    email:{ type: String, unique: true, required: [true, 'Email already exists'] },
    role: { type: String, required: true, enum: ['admin', 'super-admin']},
    token: inviteTokenSchema,
    invitedBy: { type: Schema.Types.ObjectId, ref: 'Admin'},
    profilePhoto: { type: String },
    password: { type: String },
    status: { type: Boolean, default: true, required: true },
    invitationAccepted: { type: Boolean, default: false },
}, { timestamps: true })

adminSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('Admin', adminSchema);