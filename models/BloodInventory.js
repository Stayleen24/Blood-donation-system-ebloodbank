const mongoose = require('mongoose');

const BloodInventorySchema = new mongoose.Schema({
    blood_bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank',
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    component_type: {
        type: String,
        default: 'Whole Blood'
    },
    units_available: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodInventory', BloodInventorySchema);
