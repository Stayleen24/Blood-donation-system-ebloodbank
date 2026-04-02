const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    full_name: String,
    email: String,
    phone: String,
    age: Number,
    blood_group: String,
    state: String,
    district: String,
    address: String,
    is_available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donor', DonorSchema);
