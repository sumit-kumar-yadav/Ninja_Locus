const mongoose = require('mongoose');

const socketSchema = new mongoose.Schema({
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
    dob: {
        type: String
    },
    address: {
        city: {type: String},
        state: {type: String},
        country: {type: String, default: 'India'}
    },
    contactDetails: {
        mobile: {type: String}
    }
},{
    timestamps: true
});

const Socket = mongoose.model('Socket', socketSchema);
module.exports = Socket;
