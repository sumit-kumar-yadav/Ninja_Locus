const mongoose = require('mongoose');


const passwordResetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: String,
        required: true
    }
    
},{
    timestamps: true
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
module.exports = PasswordReset;