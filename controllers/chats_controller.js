const Chat = require('../models/chat');

// Create a message
module.exports.create = async function(req, res){
    try{
        if(req.user.id){
            console.log("in create controller od chats", req.body);
            let chat = await Chat.create({
                message: req.body.message,
                from_user: req.user._id,
                to_user: req.body['to-user'],
                read: false
            })

            if(req.xhr){  // If it's ajax call
                return res.status(200).json({  // Return with JSON data
                    data: {
                        message: req.body.message
                    },
                    message: "Message sent"
                });
            }
            
            console.log("Message sent : ", chat);
            return res.redirect('back');
        }else{
            return redirect('back');
        }
    }catch(err){
        console.log('Error in creating a chat -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}


// Render the chats of a user
module.exports.chats = async function(req, res){
    try{
        if(req.user.id){
            console.log("friend id id: ", req.query)
            let chats = await Chat.find({$or:[
                { from_user: req.user._id, to_user: req.query.friendId },
                { to_user: req.user._id, from_user: req.query.friendId }
            ]})
            .sort('createdAt')   // Sort in descending order    
            .populate('from_user', '-password')
            .populate('to_user', '-password');   // Populated excluding the password

            // console.log("inside the chats controller : : : : ", chats);
            if(req.xhr){  // If it's ajax call
                return res.status(200).json({  // Return with JSON data
                    data: {
                        chats: chats
                    },
                    message: "Fetched successfully"
                });
            }
            
            console.log("Messages are : ", chats);
            return res.redirect('back');

        }else{
            return redirect('back');
        }
    }catch(err){
        console.log('Error in fetching chats -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

// Mark the messages as read
module.exports.readMessages = async function(req, res){
    try{
        // let chats = await Chat.updateMany({
        //     from_user: req.query.friendId,
        //     to_user: req.user._id,
        //     read: false
        // },
        // {$set: {read: true}},
        // { multi: true }
        // );

        let chats = await Chat.find({
            from_user: req.query.friendId,
            to_user: req.user._id,
            read: false
        });

        for(let chat of chats){
            chat.read = true;
            chat.save();
        }

        console.log("Messages are marked as read", req.query);

        return res.status(200).json({  // Return with JSON data
            data: {
                read: true
            },
            message: "Message Seen"
        });

    }catch(err){
        console.log('Error in fetching chats -->> ', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

// Check unread messages
module.exports.checkUnreadMessages = async function(req, res){
    try {
        let chats = await Chat.find({ $and: [
            { from_user: req.query.friendId },
            { to_user: req.user._id },
            { read: false }
        ] })

        // console.log("Checking the unread messages", chats);

        if(chats.length > 0){
            return res.status(200).json({  // Return with JSON data
                data: {
                    unread: true
                },
                message: "Messages are not read yet"
            });

        }else{
            return res.status(200).json({ 
                data: {
                    unread: false
                },
                message: "No new messages"
            });
        }
    } catch (error) {
        req.flash('error', err);
        return res.redirect('back');
    }
}