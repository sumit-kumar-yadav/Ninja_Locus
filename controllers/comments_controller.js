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
                post.save();       // We need to call save() after post is updated to save it in db

                res.redirect('/');
            });
        }

    });
}

// Action for deleting a comment by commenter
module.exports.destroy = function(req, res){
    Comment.findById(req.query.id, function(err, comment){
        if (comment.user == req.user.id || req.query.post_user_id == req.user.id){   

            let postId = comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postId, { $pull: {comments: req.query.id}}, function(err, post){
                return res.redirect('back');
            })
        }else{
            console.log('Cannot delete Comment');
            return res.redirect('back');
        }
    });
}