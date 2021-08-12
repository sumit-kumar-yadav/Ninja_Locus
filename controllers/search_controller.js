const User = require('../models/user');

module.exports.searchUser = async function(req, res){
    try {
        let { name } = req.query;
        // All of these should be escaped: \\ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \]
        name = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
        
        let users = await User.find({name: {
            $regex: new RegExp(name, 'i')
        }})
        .select('-password')
        .select('-friendships')
        .limit(20);

        // console.log("Users found are: ", users);
        if(users){
            return res.status(200).json({  // Return with JSON data
                data: {
                    searchedUsers: users
                },
                message: "User found"
            });
        }
        else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in searching a user -->> ', error);
        req.flash('error', error);
        return res.redirect('back');
    }
}