const Post = require('../models/post');
const Comment = require('../models/comment');

// Creating a post
module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
       
        console.log('Post Created');
        return res.redirect('back');

    }catch(err){
        console.log('Error in creating a post -->> ', err);
        return;
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
            return res.redirect('back');

        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error in deleting a post -->> ', err);
        return;
    }
}