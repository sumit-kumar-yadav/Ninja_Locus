const Comment = require('../models/comment');
const Post = require('../models/post');

// Action for creating a comment
module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);

        if (post){  // If post is found then
            let comment = await Comment.create({  // Create comment
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
            // push comment id in the array of comments in post
            post.comments.push(comment); // mongoose will automatically extract id from it
            post.save();       // We need to call save() after post is updated to save it in db

            // If it's Ajax request
            if (req.xhr){
                // Similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name').execPopulate();
    
                return res.status(200).json({
                    data: {
                        comment: comment,
                        post_user_id: post.user   // Also send the id of user who created the post.
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }

    }catch(err){
        console.log('Error in creating a comment -->> ', err);
        req.flash('error', err);
        return;
    }
}


// Action for deleting a comment
module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.query.id);

        if (comment.user == req.user.id || req.query.post_user_id == req.user.id){   // To be deleted only by the commenter or poster

            let postId = comment.post;  // Save the postId
            comment.remove();   // Delete the comment

            // Delete the comment id from the array of comments in the post
            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.query.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.query.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            console.log('Cannot delete Comment');
            req.flash('error', 'Unauthorized');

            return res.redirect('back');
        }

    }catch(err){
        console.log('Error in deleting a comment -->> ', err);
        req.flash('error', err);
        return;
    }
    
    
}