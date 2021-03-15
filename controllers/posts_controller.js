const Post = require('../models/post');
const Comment = require('../models/comment');

// Creating a post
module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

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

       
        console.log('Post Created');

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        console.log('Error in creating a post -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}


// Deleting a post and it's comments
module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        // Verify the poster is deleting the post
        if (post.user == req.user.id){  // .id means converting the object id into string
            post.remove();  // delete the post

            await Comment.deleteMany({post: req.params.id});  // delete it's comments

            // If it's AJAX request
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            
            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');

        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error in deleting a post -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}