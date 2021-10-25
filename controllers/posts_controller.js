const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// Creating a post
module.exports.create = async function(req, res){
    try{
        // Use multer to put req.body and req.file in req
        Post.uploadedPost(req, res, async function(err){
            if(err){
                console.log('** Multer Error in uploading post image: ', err);
                return res.status(401).send('Failed- Invalid file');
            }

            // console.log("req.file", req.file, req.body); console.dir(req.headers['content-type'])

            // Create the post
            let post = await Post.create({
                content: req.body.content.replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/(?:\r\t|\r|\t)/g, '&emsp;'),
                user: req.user._id
            });
            // console.log("Before: ", req.body.content);
            // console.log("After:", req.body.content.replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/(?:\r\t|\r|\t)/g, '&emsp;'));
            // console.log("After regExp:", req.body.content.replace(new RegExp('\r?\n', 'g'), '<br />'));

            // if image is present
            if(req.file){   // file is put by the multer
                // then save it's location in the postPath schema
                post.postPath = Post.postPath + '/' + req.file.filename;
                post.mediaType = req.file.mimetype.split('/')[0];
                post.save();  // Important
            }

            // If it's AJAX request
            if (req.xhr){
                // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
                post = await post.populate('user', 'name').execPopulate();

                return res.status(200).json({  // Return with JSON data
                    data: {
                        post: post
                    },
                    message: "Post created!"
                });
            }

            req.flash('success', 'Post published!');
            return res.redirect('back');

        })

    }catch(err){
        console.log('Error in creating a post -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}


// Deleting a post and it's comments
module.exports.destroy = async function(req, res){
    let post;
    try{
        post = await Post.findById(req.params.id);

        // Verify the poster is deleting the post
        if (post.user == req.user.id){  // .id means converting the object id into string

            // Delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({likeable: {$in: post.comments}, onModel: 'Comment'});
            // await Like.deleteMany({_id: {$in: post.comments}});   -->> They coded, (But was not deleted when checked)  :(

            // Delete it's comments
            await Comment.deleteMany({post: req.params.id});

            // Delete the post's image if present
            if(post.postPath){
                // delete it from the file system
                fs.unlinkSync(path.join(__dirname, '..', '..', post.postPath));
            }

            post.remove();  // delete the post

            // If it's AJAX request
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            
            req.flash('success', 'Post deleted!');
            return res.redirect('back');

        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error in deleting a post -->> ', err);
        // If getting error in removing post image then perform the rest work
        if(err.code === 'ENOENT'){
            post.remove();
            // If it's AJAX request
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Post deleted!');
            return res.redirect('back');
        }
        req.flash('error', err);
        return res.redirect('back');
    }
}