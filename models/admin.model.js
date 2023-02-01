import { Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const inviteTokenSchema = Schema({
    token: { type: String, required: true },
    expires: { type: Date },
})

const adminSchema = Schema({
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    email:{ type: String, unique: true, required: true },
    role: { type: String, required: true, enum: ['admin', 'super-admin']},
    token: inviteTokenSchema,
    invitedBy: { type: Schema.Types.ObjectId, ref: 'Admin'},
    profilePhoto: { type: String },
    password: { type: String }
})

adminSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = model('Admin', adminSchema);