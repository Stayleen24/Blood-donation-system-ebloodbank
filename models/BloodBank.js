const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: String,
    district: String,
    address: String,
    phone: String,
    email: String,
    category: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodBank', BloodBankSchema);
