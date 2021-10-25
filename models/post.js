const mongoose = require('mongoose');
const multer = require('multer');
const usersPost = require('../config/imagesUploads');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    // Image url
    postPath: {
        type: String
    },
    mediaType: {    //  audio / video
        type: String
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]

},{
    timestamps: true
});


// static methods (used in the post upload)
postSchema.statics.uploadedPost = multer({
    storage: usersPost.storage('post'),
    limits: {
        fileSize: 15000000      // 15000000 Bytes = 15 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|gif|svg|mp4|PNG|JPG|JPEG|GIF|SVG|MP4)$/)) { 
           return cb(new Error('Please upload Valid file'))
         }
       cb(undefined, true)
    }
}).single('postImage');

postSchema.statics.postPath = usersPost.POST_PATH;


const Post = mongoose.model('Post', postSchema);
module.exports = Post;