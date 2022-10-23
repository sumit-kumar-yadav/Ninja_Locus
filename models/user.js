const mongoose = require('mongoose');
const multer = require('multer');
const usersAvatar = require('../config/imagesUploads');


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
    ],
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo'
    }

}, {
    timestamps: true
});


// static methods
userSchema.statics.uploadedAvatar = multer({
    storage: usersAvatar.storage('avatar'),
    limits: {
        fileSize: 8000000      // 8000000 Bytes = 8 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|gif|svg|PNG|JPG|JPEG|GIF|SVG)$/)) { 
           return cb(new Error('Please upload Valid file'))
         }
       cb(undefined, true)
    }
}).single('avatar');

userSchema.statics.avatarPath = usersAvatar.AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;