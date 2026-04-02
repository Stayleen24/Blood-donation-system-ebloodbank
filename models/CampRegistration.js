const mongoose = require('mongoose');

const CampRegistrationSchema = new mongoose.Schema({
    camp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodCamp'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    full_name: String,
    email: String,
    phone: String,
    age: Number,
    blood_group: String,
    certificate_id: String,
    has_donated: {
        type: Boolean,
        default: false
    },
    donated_at: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CampRegistration', CampRegistrationSchema);
