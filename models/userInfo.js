const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gender: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    status: {
        type: String
    },
    dob: {
        type: Date
    },
    address: {
        city: {type: String},
        state: {type: String},
        country: {type: String, default: 'India'}
    },
    privacy: {
        private_accout: { type: Boolean, default: false }
    }
},{
    timestamps: true
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);
module.exports = UserInfo;
