const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');

// Using Async Await
module.exports.home = async function(req, res){

    try{
        // If user is logged in then show home page
        if(req.user){
            let users = await User.find({});   //  Find all the users to send them on home page    ***** TODO: Don't set the password to browser  *****
            let loggedInUser;
            let friendsPosts = [];
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
                
                
                // Find all the friendship of user
                let acceptedFriendship = await Friendship.find({_id: {$in: req.user.friendships}, accepted: true});
                
                // If there exist atleast 1 friendship of user
                if(acceptedFriendship){
                    let posterIdList = [];
                    for(let i of acceptedFriendship){
                        if(i.from_user == req.user.id){
                            posterIdList.push(i.to_user);
                        }else{
                            posterIdList.push(i.from_user);
                        }
                        posterIdList.push(req.user.id);
                        
                        friendsPosts = await Post.find({user: {$in: posterIdList}})
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
                        })
                        .populate('likes');
                    }
                }
                
            }
            
            return res.render('home', {
                title: "Ninja Locus | Home",
                posts:  friendsPosts,
                all_users: users,
                logged_in_user: loggedInUser
            });

        }else{
            // Show welcome page
            return res.render('welcome_page', {
                title: "Ninja Locus | Welcome"
            });
        }
            
    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

