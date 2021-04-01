const Post = require('../models/post');
const User = require('../models/user');

// Using Async Await
module.exports.home = async function(req, res){

    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')   // To show the latest post first
        .populate('user')
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user'
                },
                {
                    path: 'likes'
                }
            ]
                    // Sir coded -->> But Wrong way because populate will be overwritten by the latter one
            // populate: {
            //     path: 'user'
            // },
            // populate: {
            //     path: 'likes'
            // }
        }).populate('likes');
    
        let users = await User.find({});   //  Find all the users to send them on home page    ***** TODO: Don't set the password to browser  *****
        let loggedInUser;
        if(req.user){   //  Find all the friends of the user if user is logged in
            loggedInUser = await User.findById(req.user._id)
            .populate({
                path: 'friendships',
                populate: [
                    {
                        path: 'from_user'  // ***** TODO: Don't set the password to browser  *****
                    },
                    {
                        path: 'to_user'   // ***** TODO: Don't set the password to browser  *****
                    }
                ]
            });

        }

        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users: users,
            logged_in_user: loggedInUser
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

