const mongoose = require('mongoose');

const BloodCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizer: String,
    description: String,
    camp_date: Date,
    start_time: String,
    end_time: String,
    state: String,
    district: String,
    max_donors: {
        type: Number,
        default: 0
    },
    contact_phone: String,
    status: {
        type: String,
        enum: ['upcoming', 'completed'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodCamp', BloodCampSchema);
