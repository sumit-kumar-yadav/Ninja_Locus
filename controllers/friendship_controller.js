const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriendship = async function(req, res){
    try{

        let user = await User.findById(req.user._id);
        let friend = await User.findById(req.params.id);
        let friendAdded = false;

        // Check if friendship already exists
        let existingFriendship = await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.params.id
        })

        // Also check whether vise versa friendship exists or not
        let existingFriendshipReverse = await Friendship.findOne({
            from_user: req.params.id,
            to_user: req.user._id
        })


        // If friendship already exists then remove it
        if(existingFriendship || existingFriendshipReverse){
            if(existingFriendship){
                user.friendships.pull(existingFriendship._id);  // Remove from the friend list of the user
                user.save();
                friend.friendships.pull(existingFriendship._id);  //  Also remove from the friend list of the friend
                friend.save();
                existingFriendship.remove();
            }else{
                user.friendships.pull(existingFriendshipReverse._id);   // Remove from the friend list of the user
                user.save();
                friend.friendships.pull(existingFriendshipReverse._id);   //  Also remove from the friend list of the friend
                friend.save();
                existingFriendshipReverse.remove();
            }

        }else{
            // Create the friendship
            let friendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.params.id
            });
    
            // Also save the friendship id in the array of friendship of user schema
            user.friendships.push(friendship);
            user.save();
            friend.friendships.push(friendship);
            friend.save();
            friendAdded = true;

        }

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