import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    domain: { type: String, required: true }, 
}, { timestamps: true });

const Adminm = mongoose.model('Admin', adminSchema);

export { Adminm as Admin}