const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriendship = async function(req, res){
    try{

        let user = await User.findById(req.user._id);
        let friend = await User.findById(req.params.id);
        let friendAdded = false;

        // Find all the friendship of user
        let existingFriendship = await Friendship.find({_id: {$in: req.user.friendships}});

        // If there exist atleast 1 friendship of user
        if(existingFriendship){
            for(let i of existingFriendship){
                // If friendship already exist between user and friend, then remove it
                if((i.from_user == req.user.id && i.to_user == req.params.id)
                    || (i.from_user == req.params.id && i.to_user == req.user.id)
                ){
                    // Remove the friendship
                    user.friendships.pull(i._id);  // Remove from the friend list of the user
                    user.save();
                    friend.friendships.pull(i._id);  //  Also remove from the friend list of the friend
                    friend.save();
                    i.remove();
                    console.log("friend removed");

                    return res.json(200, {
                        message: "Request successful!",
                        data: {
                            friendAdded: friendAdded
                        }
                    })
                }
            }
        }

        // If there is no friendship, Create the friendship
        let friendship = await Friendship.create({
            from_user: req.user._id,
            to_user: req.params.id,
            accepted: false
        });

        // Also save the friendship id in the array of friendship of user schema
        user.friendships.push(friendship);
        user.save();
        friend.friendships.push(friendship);
        friend.save();
        friendAdded = true;
        console.log("Friend added");

        return res.json(200, {
            message: "Request successful!",
            data: {
                friendAdded: friendAdded
            }
        })

    }catch(err){
        console.log('Error in adding friend', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

// accept the friend request
module.exports.acceptRequest = async function(req, res){
    try{
        let friendship = await Friendship.findByIdAndUpdate(req.params.id, {accepted: true});
        // if xhr request
        // return res.status(200).json({
        //     data: {
        //         requestAccepted: true
        //     },
        //     message: "Friendrequest accepted"
        // });
        return res.redirect('back');
    }catch(err){
        console.log('Error in Accepting friend', err);
        return res.redirect('back');
        // return res.json(500, {
        //     message: 'Internal Server Error'
        // });
    }
}

// Delete the friend request
module.exports.deleteRequest = async function(req, res){
    try{
        let friendship = await Friendship.findByIdAndDelete(req.params.id);
        console.log("Friendship is: ", friendship)
        // Also remove from the friendships array of both users schema
        let sender = await User.findById(friendship.from_user);
        let receiver = await User.findById(friendship.to_user);
        console.log("sender and reciever are: ", sender, receiver);
        sender.friendships.pull(friendship._id);
        receiver.friendships.pull(friendship._id);
        sender.save();
        receiver.save();

        // if it's xhr request
        // return res.status(200).json({
        //     data: {
        //         requestAccepted: false
        //     },
        //     message: "Friendrequest deleted"
        // });
        return res.redirect('back');
    }catch(err){
        console.log('Error in Deleting friend', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

// Remove Friend
module.exports.removeFriend = async function(req, res){
    try{
        let friendship = await Friendship.findByIdAndDelete(req.params.id);
        // Also remove from the friendships array of both users schema
        let sender = await User.findById(friendship.from_user);
        let receiver = await User.findById(friendship.to_user);
        sender.friendships.pull(friendship._id);
        receiver.friendships.pull(friendship._id);
        sender.save();
        receiver.save();

        // if it's xhr request
        // return res.status(200).json({
        //     data: {
        //         requestAccepted: false
        //     },
        //     message: "Friendrequest deleted"
        // });
        return res.redirect('back');
    }catch(err){
        console.log('Error in Removing friend', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

// Add Friend
// TODO