const mongoose = require('mongoose');

const socketSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Socket = mongoose.model('Socket', socketSchema);
module.exports = Socket;
