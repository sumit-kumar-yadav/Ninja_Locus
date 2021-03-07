const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                // handle error

                // console.log(comment);
                post.comments.push(comment); // mongoose will automatically extract id from it
                post.save();       // We need to call save() everytime post is updated to save it in db

                res.redirect('/');
            });
        }

    });
}