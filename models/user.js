const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    friendships: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship' 
        }
    ]

}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {  // cb is callback function
      cb(null, path.join(__dirname, '..', AVATAR_PATH)); // To set the destination of the file in local disc storage
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());  // Date.now() method returns the number of milliseconds since January 1, 1970 00:00:00 UTC.
      // It's used to differentiate the files with same name set by the uploader users to prevent overwriting the existing file
    }
})


// static methods
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;